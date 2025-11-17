import { Types } from 'mongoose';
import { EntityId, Identifier } from 'domain/_core';

export const isValid = (id: string | number | Types.ObjectId): boolean =>
  Types.ObjectId.isValid(id);

export function createObjectId(value: string): Types.ObjectId {
  return new Types.ObjectId(value);
}

export function identifierToObjectId(
  value?: Identifier | null,
): Types.ObjectId | null | undefined {
  return value != null
    ? createObjectId(value.toString())
    : (value as null | undefined);
}

export function objectIdToIdentifier(
  value?: Types.ObjectId | null,
): Identifier | null | undefined {
  return value != null
    ? new EntityId(value.toString())
    : (value as null | undefined);
}
