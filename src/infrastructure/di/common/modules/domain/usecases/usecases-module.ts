import {Module} from '@nestjs/common';
import {Symbols} from 'di/common';
// import { AuditLogModule } from 'di/common/modules/domain/entities/audit-log-module';
import {ProcessTransactionUsecase, ProcessTransactionUsecaseImpl} from "usecases/process-transaction-usecase";
import {ProcessingConfigService} from "domain/_processor/processing-config/service";
import {MaskingEngine} from "domain/_processor";
import {EnginesModule} from "di/common/modules/domain/services/engines-module";
import {UtilsModule} from "di/common/modules/domain/services/utils-module";
import {TransactionModule} from "di/common/modules/domain/entities/transaction-module";
import {TransactionService} from "domain/transaction/service";

@Module({
  imports: [
    // AuditLogModule,
      UtilsModule,
      EnginesModule,
      TransactionModule,
  ],
  providers: [
      {
          provide: Symbols.usecases.transactions.process,
          useFactory(
              processingConfigService: ProcessingConfigService,
              maskingEngine: MaskingEngine,
              transactionService: TransactionService,
          ): ProcessTransactionUsecase {
              return new ProcessTransactionUsecaseImpl(
                  processingConfigService,
                  maskingEngine,
                  transactionService
              );
          },
          inject: [
              Symbols.domain.utils.processingConfig,
              Symbols.domain.engines.maskingEngine,
              Symbols.domain.transaction.service,
          ],
      },

  ],
  exports: [Symbols.usecases.transactions.process ],
})

export class UsecasesModule {}