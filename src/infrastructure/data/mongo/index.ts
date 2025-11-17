import * as mongoose from 'mongoose';

export class Db {
  private client!: mongoose.Mongoose;
  constructor() {}

  public async connect(): Promise<void> {
    this.client = await mongoose.connect('mongodb://127.0.0.1:27017/test');
  }
}

export * from './utils/identifier';
export * from './mongoose-repository';
export * from './repository';
