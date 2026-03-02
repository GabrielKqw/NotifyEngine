import { IsObject, IsOptional, IsString } from 'class-validator';

export class TriggerManualDto {
  @IsString()
  workspaceId!: string;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;

  @IsOptional()
  @IsObject()
  context?: Record<string, unknown>;
}
