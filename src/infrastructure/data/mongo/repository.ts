import { FilterQuery, SortValues, UpdateQuery } from 'mongoose';
import { Identifier } from 'domain/_core';
import { BaseEntity } from 'domain/_core/base-domain/base-entity';

// Define the utility type that handles dot notation for nested fields
export type DotNotation<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? // Recursively iterate through nested fields, joining with dot notation
      K | `${K}.${DotNotation<T[K]>}`
    : K;
}[keyof T & (string | number)];

export type SortQuery<T> = Partial<Record<DotNotation<T>, SortValues>>;

export type BulkUpdate<T> = {
  filter: Partial<T & { _id: Identifier }>;
  update:
    | {
        $max?: Partial<T>;
        $set?: Partial<T>;
        $addToSet?: Partial<T>;
        $pull?: Partial<T>;
      }
    | Partial<T>;
};

export interface Repository<T, E extends BaseEntity<T>> {
  create(entity: E): Promise<E>;

  insertMany(entities: E[]): Promise<E[]>;

  bulkInsert(entities: E[]): Promise<void>;

  getById(id: Identifier): Promise<E | null>;

  getByIds(ids: Identifier[]): Promise<E[]>;

  getByQuery(
    query: FilterQuery<T>,
    skip?: number,
    limit?: number,
    sort?: SortQuery<T>,
  ): Promise<E[]>;

  getByQueryCount(query: FilterQuery<T>): Promise<number>;

  getAll(limit?: number): Promise<E[]>;

  getAllSorted(sort: SortQuery<T>, skip?: number, limit?: number): Promise<E[]>;

  exists(filter: FilterQuery<T>): Promise<boolean>;

  getStream(
    query: FilterQuery<T>,
    sort?: SortQuery<T>,
  ): AsyncIterableIterator<E>;

  save(entity: E): Promise<E>;

  updateById(id: Identifier, update: UpdateQuery<T>): Promise<E | null>;

  updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<E | null>;

  updateByIds(ids: Identifier[], update: UpdateQuery<T>): Promise<E[]>;

  updateMany(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<E[]>

  bulkUpdate(toUpdate: BulkUpdate<T>[], upsert?: boolean): Promise<void>;

  bulkSave(entities: E[]): Promise<void>;

  delete(entity: E): Promise<void>;

  deleteById(id: Identifier): Promise<void>;

  deleteByIds(ids: Identifier[]): Promise<void>;

  deleteMany(filter: FilterQuery<T>): Promise<void>;

  bulkDeleteByIds(ids: Identifier[]): Promise<void>;

  transactionalOperation(operations: () => Promise<void>): Promise<void>;
}
