import {Module} from '@nestjs/common';
import {Symbols} from 'di/common';
import {ProcessTransactionUsecase, ProcessTransactionUsecaseImpl} from "usecases/process-transaction-usecase";
import {ProcessingConfigService} from "domain/_processor/processing-config/service";
import {MaskingEngine} from "domain/_processor";
import {EnginesModule} from "di/common/modules/domain/services/engines-module";
import {UtilsModule} from "di/common/modules/domain/services/utils-module";
import {TransactionModule} from "di/common/modules/domain/entities/transaction-module";
import {TransactionService} from "domain/transaction/service";
import {GetTransactionsUsecase, GetTransactionsUsecaseImpl} from "usecases/get-transactions-usecase";
import {ChangeModule} from "di/common/modules/domain/entities/change-module";
import {ChangeService} from "domain/change/service";
import {GetTransactionUsecase, GetTransactionUsecaseImpl} from "usecases/get-transaction-usecase";

@Module({
  imports: [
      UtilsModule,
      EnginesModule,
      TransactionModule,
      ChangeModule,
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
      {
          provide: Symbols.usecases.transactions.get,
          useFactory(
              transactionService: TransactionService,
          ): GetTransactionsUsecase {
              return new GetTransactionsUsecaseImpl(
                  transactionService
              );
          },
          inject: [
              Symbols.domain.transaction.service,
          ],
      },
      {
          provide: Symbols.usecases.transactions.getOne,
          useFactory(
              transactionService: TransactionService,
              changeService: ChangeService,
          ): GetTransactionUsecase {
              return new GetTransactionUsecaseImpl(
                  transactionService,
                  changeService
              );
          },
          inject: [
              Symbols.domain.transaction.service,
              Symbols.domain.change.service,
          ],
      },

  ],
  exports: [Symbols.usecases.transactions.process, Symbols.usecases.transactions.get, Symbols.usecases.transactions.getOne, ],
})

export class UsecasesModule {}