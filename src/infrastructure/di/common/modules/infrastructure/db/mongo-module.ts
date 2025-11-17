import { Module } from '@nestjs/common';
import { MongooseModule as Mongoose } from '@nestjs/mongoose';
import { plugin } from 'mongoose';
import { sessionPlugin } from 'infrastructure/data/mongo/mongoose-session-plugin';
import { MongoId } from 'infrastructure/data/mongo/utils/id-generator';
import { Symbols } from 'infrastructure/di/common/symbols';
import { config } from 'infrastructure/config/config';

@Module({
  imports: [
    Mongoose.forRootAsync({
      useFactory: () => {

        plugin(sessionPlugin);

        return {
          uri: config.mongo.connectionString,
          // authSource,
          // users: username,
          // pass: password,
          // dbName,
        };
      },
      inject: [],
    }),
  ],
  providers: [
    {
      provide: Symbols.infrastructure.db.idGenerator,
      useClass: MongoId,
    },
  ],
  exports: [Symbols.infrastructure.db.idGenerator],
})
export class MongooseModule {}