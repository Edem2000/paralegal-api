import { HexString } from 'domain/_core/identifier';

export interface IdGenerator {
  generate(): HexString;
}
