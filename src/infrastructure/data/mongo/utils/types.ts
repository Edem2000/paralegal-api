import { Model, Schema } from 'mongoose';

export type ExtractGeneric<Type> =
  Type extends Schema<infer X, Model<infer X, any, any>, object> ? X : never;

export type SchemaToModel<T extends object> = {
  [K in keyof T]: Model<ExtractGeneric<T[K]>, NonNullable<unknown>>;
};
