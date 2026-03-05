import { Type } from 'class-transformer';
import { SmtpProvider } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpsertSmtpConfigDto {
  @IsString()
  @IsNotEmpty()
  workspaceId!: string;

  @IsOptional()
  @IsEnum(SmtpProvider)
  provider?: SmtpProvider;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  host?: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(65535)
  port?: number;

  @IsOptional()
  @IsBoolean()
  secure?: boolean;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsString()
  fromName?: string;

  @IsEmail()
  fromEmail!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
