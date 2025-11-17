import { EntityType } from 'domain/_core';

export class BaseService {
  private readonly _entityType: EntityType;

  constructor(entityType: EntityType) {
    this._entityType = entityType;
  }

  public get entityType(): EntityType {
    return this._entityType;
  }
}
