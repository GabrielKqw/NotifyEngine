import { Controller, Get, Param, Query } from '@nestjs/common';
import { ExecutionsService } from './executions.service';

@Controller('executions')
export class ExecutionsController {
  constructor(private readonly executionsService: ExecutionsService) {}

  @Get(':id')
  getById(@Param('id') id: string, @Query('workspaceId') workspaceId: string) {
    return this.executionsService.getById(id, workspaceId);
  }
}
