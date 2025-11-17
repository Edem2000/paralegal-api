import { BaseService, EntityId, Identifier } from 'domain/_core';
import {
  AuditLog,
  Actor,
  categoryByType,
  AuditLogRepository,
  ActionLogParams,
  GetAuditLogsParams,
  GetAuditLogsResult,
  AuditLogFilterQuery,
  AuditLogSortQuery,
  messageByType,
} from 'domain/audit';
import { Context } from 'domain/_core';

export interface AuditLogService {
  log(params: ActionLogParams, context: Context): Promise<AuditLog>;
  getById(id: Identifier): Promise<AuditLog | null>;
  getAuditLogs(params: GetAuditLogsParams): Promise<GetAuditLogsResult>;
  save(auditLog: AuditLog): Promise<AuditLog>;
  getAll(): Promise<AuditLog[]>;
}

export class AuditLogServiceImpl extends BaseService implements AuditLogService {
  constructor(private readonly repository: AuditLogRepository) {
    super('auditLog');
  }

  public async log(params: ActionLogParams, context: Context): Promise<AuditLog> {
    const actorUserIdRaw = params.actorUserId;
    const actorUserId: Identifier | undefined = actorUserIdRaw && typeof actorUserIdRaw === 'string' ? new EntityId(actorUserIdRaw) : undefined;

    const data = {
      occurredAt: params.occurredAt || new Date(),
      actorType: actorUserId ? Actor.User : Actor.System,
      actorUserId: actorUserId,
      targetId: params.targetId,
      targetEntity: params.targetEntity,
      category: categoryByType[params.type],
      type: params.type,
      message: params.message || messageByType[params.type],
      metadata: params.metadata,

      requestId: context.requestId,
      correlationId: context.correlationId,
      ip: context.ip,
      userAgent: context.userAgent,
    };

    const log = new AuditLog(data);
    return await this.repository.create(log);
  }

  public async getById(id: Identifier): Promise<AuditLog | null> {
    return await this.repository.findById(id);
  }

  public async getAuditLogs(params: GetAuditLogsParams): Promise<GetAuditLogsResult> {
    const skip = (params.page - 1) * params.limit;

    const filter: AuditLogFilterQuery = Object.fromEntries(
      Object.entries({
        type: params.type,
        category: params.category,
        actorType: params.actorType,
        actorUserId: params.actorUserId,
        targetEntity: params.targetEntity,
        targetId: params.targetId,
      }).filter(([, v]) => v !== undefined && v !== null)
    );

    const sortField = params.sortBy || '_id';
    const sort: AuditLogSortQuery = {
      [sortField]: params.sortOrder === 'asc' ? 1 : -1,
    } as AuditLogSortQuery;

    const { auditLogs, total } = await this.repository.getAuditLogs(filter, sort, params.limit, skip);

    return { auditLogs, total };
  }

  public async save(auditLog: AuditLog): Promise<AuditLog> {
    return await this.repository.save(auditLog);
  }

  public async getAll(): Promise<AuditLog[]> {
    return  await this.repository.getAll();
  }
}