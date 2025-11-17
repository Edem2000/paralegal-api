import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { PaginatedDto } from 'infrastructure/controllers/dtos/common/paginated-dto';
import { Actor, AuditCategory, AuditType, TargetEntity } from 'domain/audit';
import { Type } from 'class-transformer';
import { Identifier } from 'domain/_core';

export class GetAuditLogsDto extends PaginatedDto{

  @IsOptional()
  @IsEnum(AuditCategory)
  category?: AuditCategory;

  @IsOptional()
  @IsEnum(AuditType)
  type?: AuditType;

  @IsOptional()
  @IsEnum(Actor)
  actorType?: Actor;

  @IsOptional()
  @IsString()
  @Type(() => String)
  actorUserId?: Identifier;

  @IsOptional()
  @IsEnum(TargetEntity)
  targetEntity?: TargetEntity;

  @IsOptional()
  @IsString()
  @Type(() => String)
  targetId?: Identifier;
}
