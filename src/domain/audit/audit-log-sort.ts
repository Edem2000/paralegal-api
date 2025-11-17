export const AuditLogSortField = {
  Id: '_id',
  Name: 'name',
} as const;

export const AuditLogSortFields = Object.values(AuditLogSortField);

export type AuditLogSortField = typeof AuditLogSortField[keyof typeof AuditLogSortField];