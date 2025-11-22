import {Module} from '@nestjs/common';
import {AppModule} from 'services/core/app.module';
import {RealmModule} from "di/common/modules/infrastructure/db/realm-module";

@Module({
  imports: [
      // MongooseModule,
      RealmModule,
      AppModule],
})
export class CoreContainer {}
