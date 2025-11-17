import { AuditLogModel } from 'domain/audit';
import { Schema, Types } from 'mongoose';
import { BaseSchema } from 'data/mongo/schemas/base-schema';
import { CollectionNames } from 'di/common';
import { identifierToObjectId, objectIdToIdentifier } from 'data';
import { Identifier } from 'domain/_core';

export const AuditLogSchema: BaseSchema<AuditLogModel> = new BaseSchema(
  {
    occurredAt: {
      type: Date,
      required: true,
      index: true,
    },
    actorType: {
      type: String,
      enum: ['user', 'system'],
      required: true,
    },
    actorUserId: {
      type: Types.ObjectId,
      get: objectIdToIdentifier as (value: any) => Identifier,
      set: identifierToObjectId,
      required: false,
      index: true,
    },
    targetEntity: {
      type: String,
      required: false,
      index: true,
    },
    targetId: {
      type: Types.ObjectId,
      get: objectIdToIdentifier as (value: any) => Identifier,
      set: identifierToObjectId,
      required: false,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      index: true,
    },
    message: {
      type: {
        ru: String,
        uz: String,
        en: String,
      },
      _id: false,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    requestId: {
      type: String,
      index: true,
    },
    correlationId: { // TODO: SESSION_ID?
      type: String,
      required: false,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: CollectionNames.auditLogs,
    versionKey: false,
    strict: true,

  },
);