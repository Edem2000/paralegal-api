export type HexString = string;

export interface Identifier {
  type: 'Identifier';

  toString(): string;
}

export type IdentifierToString<T> = {
  [K in keyof T]: T[K] extends Identifier | undefined | null
    ? T[K] extends Identifier | undefined
      ? string
      : T[K] extends Identifier | null
        ? string | null
        : string | undefined
    : T[K] extends object
      ? IdentifierToString<T[K]>
      : T[K];
};

export class EntityId implements Identifier {
  public type = 'Identifier' as const;

  constructor(private identifier: unknown | null | undefined) {}

  public toString(): string {
    return this.identifier as string;
  }
}
