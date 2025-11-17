import { Identifier } from 'domain/_core';
import { AuditLog, AuditLogFilterQuery, AuditLogSortQuery, GetAuditLogsResult } from 'domain/audit';

export interface AuditLogRepository {
  create(audit: AuditLog): Promise<AuditLog>;
  save(audit: AuditLog): Promise<AuditLog>;
  findById(id: Identifier): Promise<AuditLog | null>;
  getAuditLogs(
    filter: AuditLogFilterQuery,
    sort: AuditLogSortQuery,
    limit: number,
    skip: number
  ): Promise<GetAuditLogsResult>;
  getAll(limit?: number, skip?: number): Promise<AuditLog[]>
}
