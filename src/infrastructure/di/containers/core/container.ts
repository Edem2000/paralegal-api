import { Module } from '@nestjs/common';
import { MongooseModule } from 'infrastructure/di/common/modules/infrastructure/db/mongo-module';
import { AppModule } from 'services/core/app.module';

@Module({
  imports: [ MongooseModule, AppModule],
})
export class CoreContainer {}
