import { BaseModel, Identifier, MultiLanguage } from 'domain/_core';
import {
  Actor,
  AuditCategory,
  AuditLog,
  AuditLogModel,
  AuditLogSortField,
  AuditType,
  TargetEntity,
} from 'domain/audit';

export type CreateAuditLogParams = Omit<AuditLogModel, 'actorType'>;

export type ActionLogParams = {
  occurredAt?: Date,
  actorUserId?: Identifier | string,
  targetEntity: TargetEntity,
  targetId?: Identifier,
  type: AuditType,
  message?: MultiLanguage,
  metadata?: Record<string, unknown>,
};



export type GetAuditLogsParams = {
  page: number,
  limit: number,
  sortBy?: AuditLogSortField,
  sortOrder: 'asc' | 'desc',
} & AuditLogFilterQuery;

export type GetAuditLogsResult = {
  auditLogs: AuditLog[],
  total: number
};

export type AuditLogFilterQuery = {
  actorType?: Actor,
  actorUserId?: Identifier,
  targetEntity?: TargetEntity,
  targetId?: Identifier,
  category?: AuditCategory,
  type?: AuditType,
};

export type AuditLogSortQuery = {
  [K in AuditLogSortField]: { [key in K]: 1 | -1 }
}[AuditLogSortField];

