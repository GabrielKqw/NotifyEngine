import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SendTestEmailDto {
  @IsString()
  workspaceId!: string;

  @IsEmail()
  to!: string;

  @IsOptional()
  @IsString()
  subject?: string;
}
