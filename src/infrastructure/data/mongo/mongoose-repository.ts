import {
  Aggregate,
  AggregateOptions,
  AnyBulkWriteOperation,
  Cursor,
  FilterQuery,
  Model,
  PipelineStage,
  SortValues,
  UpdateQuery,
} from 'mongoose';

import { BulkUpdate, Repository, SortQuery } from 'data';
import { BaseModel, Identifier } from 'domain/_core';
import { BaseEntity, EntityClass } from 'domain/_core/base-domain/base-entity';
import { identifierToObjectId } from 'infrastructure/data/mongo/utils/identifier';
import { sessionStorage } from './mongoose-session-plugin';
import {
  EntityConversionError,
  MongoCreateError,
  MongoDeleteError,
  MongoReadError,
  MongoUpdateError,
} from './repository-errors';

export type EntityModel<T extends BaseModel> = Model<T>;

export class MongooseRepository<T extends BaseModel, E extends BaseEntity<T>>
  implements Repository<T, E>
{
  protected readonly entityClass: EntityClass<T, E>;
  protected readonly model: EntityModel<T>;

  constructor(entityModel: EntityModel<T>, entityClass: EntityClass<T, E>) {
    this.model = entityModel;
    this.entityClass = entityClass;
  }

  protected resolveModelForEntity(entity: E): EntityModel<T> {
    return this.model;
  }

  // Private methods
  private defineModel(entity: E, id?: Identifier): E {
    const modelClass = this.resolveModelForEntity(entity);
    const model = new modelClass();
    Object.assign(model, (entity as any).model);
    (entity as any).model = model;
    if (id) (entity as any).model._id = id;
    return entity;
  }

  toEntity(doc: T | null): E | null {
    if (!doc) return null;
    const entity = new this.entityClass(doc);
    //РќРµ СѓР±РёСЂР°С‚СЊ Object.defineProperty
    Object.defineProperty(entity, 'model', { enumerable: false, value: doc });
    return entity;
  }

  private toEntities(docs: T[]): E[] {
    return docs.map((doc) => {
      const entity = this.toEntity(doc);
      if (entity === null) {
        throw new EntityConversionError('', { doc });
      }
      return entity;
    });
  }

  private async *asyncIteratorFromCursor(
    cursor: Cursor<T>,
  ): AsyncIterableIterator<E> {
    for await (const doc of cursor) {
      const entity = this.toEntity(doc);
      if (entity !== null) {
        yield entity;
      }
    }
  }

  // Creation methods
  public async create(entity: E): Promise<E> {
    try {
      const entityWithModel = this.defineModel(
        entity,
        (entity.toJSON() as T).id,
      );
      return await this.save(entityWithModel);
    } catch (error) {
      throw new MongoCreateError(error);
    }
  }

  public async insertMany(entities: E[]): Promise<E[]> {
    try {
      const data = entities.map((entity) => entity.toJSON() as T);
      const docs = await this.model.insertMany(data);
      return this.toEntities(docs);
    } catch (error) {
      throw new MongoCreateError(error);
    }
  }

  public async bulkInsert(entities: E[]): Promise<void> {
    try {
      const data = entities.map((entity) => entity.toJSON() as T);
      const bulkOps = data.map((doc) => ({
        insertOne: { document: doc },
      }));
      await this.model.bulkWrite(bulkOps as AnyBulkWriteOperation<any>[]);
    } catch (error) {
      throw new MongoCreateError(error);
    }
  }

  // Read methods
  public async getById(id: Identifier): Promise<E | null> {
    try {
      const doc = await this.model.findById(id).exec();
      return this.toEntity(doc as T);
    } catch (error) {
      throw new MongoReadError(error);
    }
  }

  public async getByIds(ids: Identifier[]): Promise<E[]> {
    try {
      const objectIds = ids.map(identifierToObjectId);
      return await this.find({ _id: { $in: objectIds } });
    } catch (error) {
      throw new MongoReadError(error);
    }
  }

  public async getByQuery(
    query: FilterQuery<T>,
    skip = 0,
    limit = 0,
    sort?: SortQuery<T>,
  ): Promise<E[]> {
    try {
      return await this.find(query, { sort, skip, limit });
    } catch (error) {
      throw new MongoReadError(error);
    }
  }

  public async getByQueryCount(query: FilterQuery<T>): Promise<number> {
    try {
      return await this.model.countDocuments(query).exec();
    } catch (error) {
      throw new MongoReadError(error);
    }
  }

  public async getAll(limit = 0, skip = 0): Promise<E[]> {
    try {
      return await this.find({}, { limit, skip });
    } catch (error) {
      throw new MongoReadError(error);
    }
  }

  public async getAllSorted(
    sort: SortQuery<T>,
    skip = 0,
    limit = 0,
  ): Promise<E[]> {
    try {
      return await this.find({}, { sort, skip, limit });
    } catch (error) {
      throw new MongoReadError(error);
    }
  }

  public async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const result = await this.model.exists(filter).exec();
      return result !== null && result !== undefined;
    } catch (error) {
      throw new MongoReadError(error);
    }
  }

  public getStream(
    query: FilterQuery<T>,
    sort?: SortQuery<T>,
  ): AsyncIterableIterator<E> {
    const queryBuilder = this.model.find(query).sort(sort as any);
    const cursor = queryBuilder.cursor();
    return this.asyncIteratorFromCursor(cursor as unknown as Cursor<T>);
  }

  protected async find(
    filter: FilterQuery<T>,
    options?: {
      limit?: number;
      skip?: number;
      sort?: SortQuery<T>;
      lean?: boolean;
    },
  ): Promise<E[]> {
    const query = this.model.find(filter);

    if (options?.sort) query.sort(options.sort as any);
    if (options?.limit !== undefined) query.limit(options.limit);
    if (options?.skip !== undefined) query.skip(options.skip);

    if (options?.lean) query.lean();

    const docs = await query.exec();
    return this.toEntities(docs);
  }

  protected async findOne(
    filter: FilterQuery<T>,
    options?: { sort?: Partial<Record<keyof T, SortValues>>; lean?: boolean },
  ): Promise<E | null> {
    const query = this.model.findOne(filter);

    if (options?.sort) query.sort(options.sort as any);

    if (options?.lean) query.lean();

    const doc = await query.exec();
    return this.toEntity(doc);
  }

  // Update methods
  public async save(entity: E): Promise<E> {
    try {
      const savedModel = await (entity as any).model.save();
      return this.toEntity(savedModel) as E;
    } catch (error) {
      throw new MongoUpdateError(error);
    }
  }

  public async updateById(id: Identifier, update: UpdateQuery<T>,): Promise<E | null> {
    try {
      const doc = await this.model
        .findByIdAndUpdate(id, update, { new: true, lean: true })
        .exec();
      return this.toEntity(doc as T);
    } catch (error) {
      throw new MongoUpdateError(error);
    }
  }

  public async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>,): Promise<E | null> {
    try {
      const doc = await this.model
        .findOneAndUpdate(filter, update, { new: true, lean: true })
        .exec();
      return this.toEntity(doc as T);
    } catch (error) {
      throw new MongoUpdateError(error);
    }
  }

  public async updateByIds(
    ids: Identifier[],
    update: UpdateQuery<T>,
  ): Promise<E[]> {
    try {
      const objectIds = ids.map(identifierToObjectId);
      await this.model.updateMany({ _id: { $in: objectIds } }, update).exec();
      const updatedDocs = await this.model
        .find({ _id: { $in: objectIds } })
        .lean()
        .exec();
      return this.toEntities(updatedDocs as T[]);
    } catch (error) {
      throw new MongoUpdateError(error);
    }
  }

  public async updateMany(filter: FilterQuery<T>, update: UpdateQuery<T>,): Promise<E[]> {
    try {
      await this.model.updateMany(filter, update).exec();
      const updatedDocs = await this.model
        .find(filter)
        .lean()
        .exec();
      return this.toEntities(updatedDocs as T[]);
    } catch (error) {
      throw new MongoUpdateError(error);
    }
  }

  public async bulkUpdate(
    toUpdate: BulkUpdate<T>[],
    upsert = true,
  ): Promise<void> {
    try {
      const bulkOps = toUpdate.map((update) => ({
        updateOne: {
          filter: update.filter,
          update: update.update,
          upsert,
        },
      }));
      await this.model.bulkWrite(
        bulkOps as unknown as AnyBulkWriteOperation<any>[],
      );
    } catch (error) {
      throw new MongoUpdateError(error);
    }
  }

  public async bulkSave(entities: E[]): Promise<void> {
    try {
      const bulkOps = entities.map((entity) => {
        const data = entity.toJSON() as T;
        const id = data.id;
        return {
          updateOne: {
            filter: { _id: id },
            update: data,
            upsert: true,
          },
        };
      });
      await this.model.bulkWrite(bulkOps as AnyBulkWriteOperation<any>[]);
    } catch (error) {
      throw new MongoUpdateError(error);
    }
  }

  // Deletion methods
  public async delete(entity: E): Promise<void> {
    try {
      const id = (entity.toJSON() as T).id;
      if (id) {
        await this.deleteById(id);
      } else {
        throw new MongoDeleteError('Entity does not have an _id');
      }
    } catch (error) {
      throw new MongoDeleteError(error);
    }
  }

  public async deleteById(id: Identifier): Promise<void> {
    try {
      await this.model.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new MongoDeleteError(error);
    }
  }

  public async deleteByIds(ids: Identifier[]): Promise<void> {
    try {
      const objectIds = ids.map(identifierToObjectId);
      await this.model.deleteMany({ _id: { $in: objectIds } }).exec();
    } catch (error) {
      throw new MongoDeleteError(error);
    }
  }

  public async deleteMany(filter: FilterQuery<T>): Promise<void> {
    try {
      await this.model.deleteMany(filter).exec();
    } catch (error) {
      throw new MongoDeleteError(error);
    }
  }

  public async bulkDeleteByIds(ids: Identifier[]): Promise<void> {
    try {
      const bulkOps = ids.map((id) => ({
        deleteOne: {
          filter: { _id: id },
        },
      }));
      await this.model.bulkWrite(bulkOps);
    } catch (error) {
      throw new MongoDeleteError(error);
    }
  }

  public async transactionalOperation(
    operations: () => Promise<void>,
  ): Promise<void> {
    const session = await this.model.db.startSession();
    session.startTransaction();
    try {
      await sessionStorage.run(session, async () => {
        await operations();
      });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new MongoUpdateError(error);
    } finally {
      session.endSession();
    }
  }

  public async aggregate<T>(pipeline?: PipelineStage[], options?: AggregateOptions): Promise<Aggregate<T[]>> {
    return this.model.aggregate<T>(pipeline, options);
  }
}
