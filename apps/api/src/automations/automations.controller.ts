import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AutomationsService } from './automations.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { TriggerManualDto } from './dto/trigger-manual.dto';

@Controller('automations')
export class AutomationsController {
  constructor(private readonly automationsService: AutomationsService) {}

  @Get()
  list(@Query('workspaceId') workspaceId: string) {
    return this.automationsService.listByWorkspace(workspaceId);
  }

  @Post()
  create(@Body() dto: CreateAutomationDto) {
    return this.automationsService.create(dto);
  }

  @Post(':id/trigger/manual')
  triggerManual(@Param('id') automationId: string, @Body() dto: TriggerManualDto) {
    return this.automationsService.triggerManual(automationId, dto);
  }
}
