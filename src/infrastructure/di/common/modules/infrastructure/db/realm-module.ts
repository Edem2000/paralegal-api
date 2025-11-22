import {Module} from '@nestjs/common';
import {Symbols} from 'infrastructure/di/common/symbols';
import {RealmService} from "data";

@Module({
  imports: [
  ],
  providers: [
      RealmService,
      {
          provide: Symbols.infrastructure.db.realm,
          useExisting: RealmService,
      },
  ],
  exports: [Symbols.infrastructure.db.realm],
})
export class RealmModule {}