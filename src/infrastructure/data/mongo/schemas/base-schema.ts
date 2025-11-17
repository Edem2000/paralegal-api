import { Schema, SchemaDefinition, SchemaDefinitionType, SchemaOptions, Types } from 'mongoose';

import type { Identifier } from 'domain/_core';
import { identifierToObjectId, objectIdToIdentifier } from 'infrastructure/data';

const baseSchemaOptions: SchemaOptions<any> = {
  versionKey: false,
  id: false,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
};

export class BaseSchema<Model> extends Schema<Model> {
  constructor(schemaDefinition: SchemaDefinition<SchemaDefinitionType<Model>>, schemaOptions?: SchemaOptions<Model>) {
    super(schemaDefinition, Object.assign(baseSchemaOptions, schemaOptions || {}));
    this.addVirtual();
  }

  private addVirtual(): void {
    this.virtual('id')
      .get(function (this: { _id: Types.ObjectId }): Identifier {
        return objectIdToIdentifier(this._id)!;
      })
      .set(function (this: { _id: Types.ObjectId }, id: Identifier) {
        this._id = identifierToObjectId(id)!;
      });
  }
}
