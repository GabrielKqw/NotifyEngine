import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ActionType, ExecutionStatus, LogLevel, Prisma } from '@prisma/client';
import { Job } from 'bullmq';
import { PrismaService } from '../common/prisma.service';
import { EXECUTION_JOB, EXECUTION_QUEUE } from '../common/queue.constants';

type ExecutionJobPayload = {
  executionId: string;
};

@Processor(EXECUTION_QUEUE)
export class ExecutionProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<ExecutionJobPayload>): Promise<void> {
    if (job.name !== EXECUTION_JOB) {
      return;
    }

    const execution = await this.prisma.execution.findUnique({
      where: { id: job.data.executionId },
      include: {
        automation: {
          include: {
            actions: {
              where: { isActive: true, deletedAt: null },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!execution) {
      return;
    }

    await this.prisma.execution.update({
      where: { id: execution.id },
      data: {
        status: ExecutionStatus.RUNNING,
        startedAt: new Date(),
      },
    });

    await this.log(
      execution.workspaceId,
      execution.id,
      LogLevel.INFO,
      'Execution started',
      { jobId: job.id },
    );

    try {
      for (const action of execution.automation.actions) {
        await this.executeAction(execution.id, execution.workspaceId, action.id, action.type, action.config);
      }

      await this.prisma.execution.update({
        where: { id: execution.id },
        data: {
          status: ExecutionStatus.SUCCESS,
          finishedAt: new Date(),
        },
      });

      await this.log(execution.workspaceId, execution.id, LogLevel.INFO, 'Execution finished successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : null;

      await this.prisma.execution.update({
        where: { id: execution.id },
        data: {
          status: ExecutionStatus.FAILED,
          retryCount: {
            increment: 1,
          },
          nextRetryAt: this.computeNextRetry(job.attemptsMade),
          finishedAt: new Date(),
        },
      });

      await this.log(execution.workspaceId, execution.id, LogLevel.ERROR, 'Execution failed', {
        error: errorMessage,
        stack,
      });

      throw error;
    }
  }

  private async executeAction(
    executionId: string,
    workspaceId: string,
    actionId: string,
    type: ActionType,
    config: Prisma.JsonValue,
  ): Promise<void> {
    const idempotencyKey = `${executionId}:${actionId}`;
    const attempt = await this.prisma.executionActionAttempt.upsert({
      where: { idempotencyKey },
      update: {
        status: ExecutionStatus.RUNNING,
        startedAt: new Date(),
      },
      create: {
        executionId,
        actionId,
        idempotencyKey,
        status: ExecutionStatus.RUNNING,
        startedAt: new Date(),
      },
    });

    try {
      switch (type) {
        case ActionType.EMAIL_SMTP:
          await this.log(workspaceId, executionId, LogLevel.INFO, 'EMAIL_SMTP action queued', {
            actionId,
            config,
          });
          break;
        case ActionType.OUTBOUND_WEBHOOK:
          await this.log(workspaceId, executionId, LogLevel.INFO, 'OUTBOUND_WEBHOOK action queued', {
            actionId,
            config,
          });
          break;
        case ActionType.INTERNAL_GROUP_DISPATCH:
          await this.log(workspaceId, executionId, LogLevel.INFO, 'INTERNAL_GROUP_DISPATCH action queued', {
            actionId,
            config,
          });
          break;
        case ActionType.INTERNAL_LOG:
        default:
          await this.log(workspaceId, executionId, LogLevel.INFO, 'INTERNAL_LOG action executed', {
            actionId,
            config,
          });
          break;
      }

      await this.prisma.executionActionAttempt.update({
        where: { id: attempt.id },
        data: {
          status: ExecutionStatus.SUCCESS,
          finishedAt: new Date(),
          responsePayload: {
            ok: true,
            actionType: type,
          },
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown action error';

      await this.prisma.executionActionAttempt.update({
        where: { id: attempt.id },
        data: {
          status: ExecutionStatus.FAILED,
          finishedAt: new Date(),
          errorMessage,
        },
      });

      throw error;
    }
  }

  private computeNextRetry(attempt: number): Date {
    const delayMs = Math.min(300000, Math.pow(2, attempt + 1) * 1000);
    const jitterMs = Math.floor(Math.random() * 1000);
    return new Date(Date.now() + delayMs + jitterMs);
  }

  private async log(
    workspaceId: string,
    executionId: string,
    level: LogLevel,
    message: string,
    data?: Prisma.JsonObject,
  ): Promise<void> {
    await this.prisma.log.create({
      data: {
        workspaceId,
        executionId,
        level,
        message,
        data,
      },
    });
  }
}
