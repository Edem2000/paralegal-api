import mongoose from 'mongoose';
import { HexString, IdGenerator } from 'domain/_core';

export class MongoId implements IdGenerator {
  public generate(): HexString {
    return new mongoose.Types.ObjectId().toHexString();
  }
}
