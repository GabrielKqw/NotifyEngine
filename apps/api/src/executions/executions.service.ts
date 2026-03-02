import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ExecutionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string, workspaceId: string) {
    const execution = await this.prisma.execution.findFirst({
      where: {
        id,
        workspaceId,
      },
      include: {
        automation: true,
        attempts: {
          orderBy: { createdAt: 'asc' },
        },
        logs: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!execution) {
      throw new NotFoundException('Execution not found');
    }

    return execution;
  }
}
