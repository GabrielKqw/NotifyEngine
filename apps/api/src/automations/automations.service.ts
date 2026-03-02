import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ActionType, ConditionType, Prisma, TriggerType } from '@prisma/client';
import { Queue } from 'bullmq';
import { randomUUID } from 'crypto';
import { PrismaService } from '../common/prisma.service';
import { EXECUTION_JOB, EXECUTION_QUEUE } from '../common/queue.constants';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { TriggerManualDto } from './dto/trigger-manual.dto';

@Injectable()
export class AutomationsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(EXECUTION_QUEUE) private readonly executionQueue: Queue,
  ) {}

  listByWorkspace(workspaceId: string) {
    return this.prisma.automation.findMany({
      where: { workspaceId, deletedAt: null },
      include: {
        triggers: true,
        conditions: true,
        actions: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateAutomationDto) {
    const triggers = dto.triggers?.length
      ? dto.triggers
      : [{ type: TriggerType.MANUAL, config: { source: 'default' }, isActive: true }];
    const actions = dto.actions?.length
      ? dto.actions
      : [{ type: ActionType.INTERNAL_LOG, config: { message: 'Default action' }, order: 0, isActive: true }];
    const conditions = dto.conditions ?? [];

    return this.prisma.automation.create({
      data: {
        workspaceId: dto.workspaceId,
        templateId: dto.templateId,
        name: dto.name,
        description: dto.description,
        status: dto.status,
        isActive: dto.isActive ?? false,
        triggers: {
          create: triggers.map((trigger) => ({
            type: trigger.type,
            config: trigger.config as Prisma.InputJsonValue,
            isActive: trigger.isActive ?? true,
          })),
        },
        conditions: {
          create: conditions.map((condition, idx) => ({
            type: condition.type ?? ConditionType.CUSTOM_JSON_RULE,
            config: condition.config as Prisma.InputJsonValue,
            order: condition.order ?? idx,
            isActive: condition.isActive ?? true,
          })),
        },
        actions: {
          create: actions.map((action, idx) => ({
            type: action.type,
            config: action.config as Prisma.InputJsonValue,
            order: action.order ?? idx,
            isActive: action.isActive ?? true,
          })),
        },
      },
      include: {
        triggers: true,
        conditions: true,
        actions: true,
      },
    });
  }

  async triggerManual(automationId: string, dto: TriggerManualDto) {
    const automation = await this.prisma.automation.findFirst({
      where: {
        id: automationId,
        workspaceId: dto.workspaceId,
        deletedAt: null,
      },
      include: {
        triggers: {
          where: {
            type: TriggerType.MANUAL,
            isActive: true,
            deletedAt: null,
          },
          take: 1,
        },
      },
    });

    if (!automation) {
      throw new NotFoundException('Automation not found');
    }

    const manualTrigger = automation.triggers[0] ?? null;
    const idempotencyKey = dto.idempotencyKey ?? randomUUID();

    const execution = await this.prisma.execution.create({
      data: {
        workspaceId: dto.workspaceId,
        automationId: automation.id,
        triggerId: manualTrigger?.id,
        sourceEventId: randomUUID(),
        idempotencyKey,
        context: (dto.context ?? {}) as Prisma.InputJsonValue,
      },
    });

    await this.executionQueue.add(
      EXECUTION_JOB,
      { executionId: execution.id },
      {
        jobId: execution.id,
        attempts: execution.maxRetries + 1,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: 1000,
        removeOnFail: 1000,
      },
    );

    return {
      executionId: execution.id,
      queued: true,
    };
  }
}
