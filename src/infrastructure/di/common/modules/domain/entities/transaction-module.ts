import {Module} from "@nestjs/common";
import {Symbols} from "di/common";
import {TransactionService, TransactionServiceImpl} from "domain/transaction/service";
import {TransactionRepository} from "domain/transaction/repository";
import {TransactionRepositoryImpl} from "data/mongo/repositories/transaction-repository";
import {RealmModule} from "di/common/modules/infrastructure/db/realm-module";
import {RealmService} from "data";

@Module({
    imports: [RealmModule],
    providers: [
        {
            provide: Symbols.domain.transaction.repository,
            useFactory: (realmService: RealmService): TransactionRepository => {
                return new TransactionRepositoryImpl(realmService);
            },
            inject: [
                Symbols.infrastructure.db.realm
            ],
        },
        {
            provide: Symbols.domain.transaction.service,
            useFactory: (repository: TransactionRepository): TransactionService => {
                return new TransactionServiceImpl(repository);
            },
            inject: [
                Symbols.domain.transaction.repository
            ],
        },
    ],
    exports: [Symbols.domain.transaction.repository, Symbols.domain.transaction.service,],
})
export class TransactionModule {}
