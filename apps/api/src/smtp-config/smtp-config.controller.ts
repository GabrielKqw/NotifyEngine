import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { SendTestEmailDto } from './dto/send-test-email.dto';
import { UpsertSmtpConfigDto } from './dto/upsert-smtp-config.dto';
import { SmtpConfigService } from './smtp-config.service';

@Controller('smtp-config')
export class SmtpConfigController {
  constructor(private readonly smtpConfigService: SmtpConfigService) {}

  @Get()
  getByWorkspace(@Query('workspaceId') workspaceId: string) {
    return this.smtpConfigService.getByWorkspace(workspaceId);
  }

  @Put()
  upsert(@Body() dto: UpsertSmtpConfigDto) {
    return this.smtpConfigService.upsert(dto);
  }

  @Post('test')
  sendTest(@Body() dto: SendTestEmailDto) {
    return this.smtpConfigService.sendTestEmail(dto);
  }
}
