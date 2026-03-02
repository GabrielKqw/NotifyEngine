import {
  ActionType,
  AutomationStatus,
  ConditionType,
  TriggerType,
} from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateTriggerDto {
  @IsEnum(TriggerType)
  type!: TriggerType;

  @IsObject()
  config!: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

class CreateConditionDto {
  @IsEnum(ConditionType)
  type!: ConditionType;

  @IsObject()
  config!: Record<string, unknown>;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

class CreateActionDto {
  @IsEnum(ActionType)
  type!: ActionType;

  @IsObject()
  config!: Record<string, unknown>;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateAutomationDto {
  @IsString()
  @IsNotEmpty()
  workspaceId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsEnum(AutomationStatus)
  status?: AutomationStatus;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTriggerDto)
  triggers?: CreateTriggerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateConditionDto)
  conditions?: CreateConditionDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateActionDto)
  actions?: CreateActionDto[];
}
