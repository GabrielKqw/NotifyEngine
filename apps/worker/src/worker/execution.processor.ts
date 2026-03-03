import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ActionType, ExecutionStatus, LogLevel, Prisma } from '@prisma/client';
import { Job } from 'bullmq';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { PrismaService } from '../common/prisma.service';
import { EXECUTION_JOB, EXECUTION_QUEUE } from '../common/queue.constants';
import { decryptSecret } from '../../../../libs/shared/src/secret.util';

type ExecutionJobPayload = {
  executionId: string;
};

@Processor(EXECUTION_QUEUE)
export class ExecutionProcessor extends WorkerHost {
  private readonly smtpTransporters = new Map<
    string,
    { cacheKey: string; transporter: Transporter }
  >();

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

    if (execution.status === ExecutionStatus.SUCCESS) {
      return;
    }

    if (execution.status === ExecutionStatus.RUNNING) {
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
        await this.executeAction(
          execution.id,
          execution.workspaceId,
          action.id,
          action.type,
          action.config,
          execution.context as Record<string, unknown> | null,
        );
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
    context: Record<string, unknown> | null,
  ): Promise<void> {
    const idempotencyKey = `${executionId}:${actionId}`;
    const currentAttempt = await this.prisma.executionActionAttempt.findUnique({
      where: { idempotencyKey },
    });

    if (currentAttempt?.status === ExecutionStatus.SUCCESS) {
      return;
    }

    if (currentAttempt?.status === ExecutionStatus.RUNNING) {
      throw new Error('Action is already running for this execution');
    }

    const attempt = await this.prisma.executionActionAttempt.upsert({
      where: { idempotencyKey },
      update: {
        status: ExecutionStatus.RUNNING,
        attemptNumber: { increment: 1 },
        startedAt: new Date(),
        finishedAt: null,
        errorCode: null,
        errorMessage: null,
        responsePayload: Prisma.JsonNull,
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
          await this.sendEmailAction(workspaceId, config, context);
          break;
        case ActionType.OUTBOUND_WEBHOOK:
          await this.sendWebhookAction(config, context);
          break;
        case ActionType.INTERNAL_GROUP_DISPATCH:
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

  private async sendEmailAction(
    workspaceId: string,
    config: Prisma.JsonValue,
    context: Record<string, unknown> | null,
  ): Promise<void> {
    const actionConfig = (config as Record<string, unknown>) ?? {};
    const smtpConfig = await this.prisma.smtpConfig.findUnique({
      where: { workspaceId },
    });

    if (!smtpConfig || !smtpConfig.isActive || smtpConfig.deletedAt) {
      throw new Error('Active SMTP config not found');
    }

    const to = this.renderTemplate(String(actionConfig.to ?? ''), context);
    const subject = this.renderTemplate(String(actionConfig.subject ?? 'Notify message'), context);
    const html = this.renderTemplate(String(actionConfig.bodyHtml ?? '<p>Notify message</p>'), context);
    const text = this.renderTemplate(String(actionConfig.bodyText ?? 'Notify message'), context);

    if (!to) {
      throw new Error('EMAIL_SMTP action requires "to" in config');
    }

    const transporter = this.getSmtpTransporter(workspaceId, {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.username,
        pass: decryptSecret(smtpConfig.password),
      },
    });

    const info = await transporter.sendMail({
      from: smtpConfig.fromName ? `${smtpConfig.fromName} <${smtpConfig.fromEmail}>` : smtpConfig.fromEmail,
      to,
      subject,
      html,
      text,
    });

  }

  private async sendWebhookAction(
    config: Prisma.JsonValue,
    context: Record<string, unknown> | null,
  ): Promise<void> {
    const actionConfig = (config as Record<string, unknown>) ?? {};
    const url = String(actionConfig.url ?? '');

    if (!url) {
      throw new Error('OUTBOUND_WEBHOOK action requires "url" in config');
    }

    const method = String(actionConfig.method ?? 'POST').toUpperCase();
    const headers = (actionConfig.headers as Record<string, string> | undefined) ?? {};
    const body = actionConfig.body ?? context ?? {};
    const timeoutMsRaw = Number(actionConfig.timeoutMs ?? 10000);
    const timeoutMs = Number.isFinite(timeoutMsRaw)
      ? Math.max(1000, Math.min(timeoutMsRaw, 30000))
      : 10000;

    const response = await fetch(url, {
      method,
      headers: {
        'content-type': 'application/json',
        ...headers,
      },
      body: method === 'GET' ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status ${response.status}`);
    }

  }

  private renderTemplate(input: string, context: Record<string, unknown> | null): string {
    if (!context) {
      return input;
    }

    return input.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_full, key: string) => {
      const value = this.getContextValue(context, key);
      return value == null ? '' : String(value);
    });
  }

  private getContextValue(context: Record<string, unknown>, key: string): unknown {
    const parts = key.split('.');
    let current: unknown = context;

    for (const part of parts) {
      if (current == null || typeof current !== 'object') {
        return undefined;
      }
      current = (current as Record<string, unknown>)[part];
    }

    return current;
  }

  private computeNextRetry(attempt: number): Date {
    const delayMs = Math.min(300000, Math.pow(2, attempt + 1) * 1000);
    const jitterMs = Math.floor(Math.random() * 1000);
    return new Date(Date.now() + delayMs + jitterMs);
  }

  private async log(
    workspaceId: string,
    executionId: string | null,
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

  private getSmtpTransporter(
    workspaceId: string,
    config: Parameters<typeof nodemailer.createTransport>[0],
  ): Transporter {
    const cacheKey = `${String(config.host)}:${String(config.port)}:${String(config.secure)}:${String(config.auth?.user)}:${String(config.auth?.pass)}`;
    const existing = this.smtpTransporters.get(workspaceId);
    if (existing && existing.cacheKey === cacheKey) {
      return existing.transporter;
    }

    if (existing) {
      existing.transporter.close();
    }

    const transporter = nodemailer.createTransport(config);
    this.smtpTransporters.set(workspaceId, { cacheKey, transporter });
    return transporter;
  }
}
