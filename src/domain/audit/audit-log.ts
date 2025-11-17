import { BaseEntity, BaseModel, Identifier, MultiLanguage } from 'domain/_core';
import { Actor, AuditCategory, AuditType, TargetEntity } from 'domain/audit';

export interface AuditLogModel extends BaseModel {
  occurredAt: Date,
  actorType: Actor,
  actorUserId?: Identifier,
  targetEntity: TargetEntity,
  targetId?: Identifier,
  category: AuditCategory,
  type: AuditType,
  message?: MultiLanguage,
  metadata?: Record<string, unknown>,
  requestId?: string,
  correlationId?: string,
  ip?: string,
  userAgent?: string,
}

export class AuditLog extends BaseEntity<AuditLogModel> {
  get occurredAt(): Date {
    return this.model.occurredAt;
  }
  set occurredAt(value: Date) {
    this.model.occurredAt = value;
  }

  get actorType(): Actor {
    return this.model.actorType;
  }
  set actorType(value: Actor) {
    this.model.actorType = value;
  }

  get actorUserId(): Identifier | undefined {
    return this.model.actorUserId;
  }
  set actorUserId(value: Identifier | undefined) {
    this.model.actorUserId = value;
  }

  get targetEntity(): TargetEntity {
    return this.model.targetEntity;
  }
  set targetEntity(value: TargetEntity) {
    this.model.targetEntity = value;
  }

  get targetId(): Identifier | undefined {
    return this.model.targetId;
  }
  set targetId(value: Identifier | undefined) {
    this.model.targetId = value;
  }

  get category(): AuditCategory {
    return this.model.category;
  }
  set category(value: AuditCategory) {
    this.model.category = value;
  }

  get type(): AuditType {
    return this.model.type;
  }
  set type(value: AuditType) {
    this.model.type = value;
  }

  get message(): MultiLanguage | undefined {
    return this.model.message;
  }
  set message(value: MultiLanguage) {
    this.model.message = value;
  }

  get metadata(): Record<string, unknown> | undefined {
    return this.model.metadata;
  }
  set metadata(value: Record<string, unknown> | undefined) {
    this.model.metadata = value;
  }

  get requestId(): string | undefined {
    return this.model.requestId;
  }
  set requestId(value: string | undefined) {
    this.model.requestId = value;
  }

  get correlationId(): string | undefined {
    return this.model.correlationId;
  }
  set correlationId(value: string | undefined) {
    this.model.correlationId = value;
  }

  get ip(): string | undefined {
    return this.model.ip;
  }
  set ip(value: string | undefined) {
    this.model.ip = value;
  }

  get userAgent(): string | undefined {
    return this.model.userAgent;
  }
  set userAgent(value: string | undefined) {
    this.model.userAgent = value;
  }
}