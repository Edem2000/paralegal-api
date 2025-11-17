import { EntityModel, MongooseRepository, SortQuery } from 'data';
import { Identifier } from 'domain/_core';
import { AuditLog, AuditLogFilterQuery, AuditLogModel, AuditLogRepository, AuditLogSortQuery } from 'domain/audit';

export class AuditLogRepositoryImpl extends MongooseRepository<AuditLogModel, AuditLog> implements AuditLogRepository {
  constructor(private readonly entityModel: EntityModel<AuditLogModel>) {
    super(entityModel, AuditLog);
  }

  public async findById(id: Identifier): Promise<AuditLog | null> {
    return await this.findOne({ _id: id });
  }

  public async getAuditLogs(
    filter: AuditLogFilterQuery,
    sort: AuditLogSortQuery,
    limit: number,
    skip: number
  ): Promise<{ auditLogs: AuditLog[]; total: number }> {
    let sortCasted = sort as SortQuery<AuditLogModel>;

    let auditLogs: AuditLog[] = [];
    let total = 0;

    await this.transactionalOperation(async () => {
      auditLogs = await this.find({ ...filter }, { limit, skip, sort: sortCasted });
      total = await this.getByQueryCount({ ...filter });
    });

    return { auditLogs, total };
  }
}
