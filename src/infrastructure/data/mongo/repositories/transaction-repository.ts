import {Injectable} from "@nestjs/common";
import {RealmService} from "data/mongo";
import {BSON} from "realm";
import {TransactionRealm} from "data/mongo/schemas/transaction-schema";
import {TransactionStatus} from "domain/transaction/transaction-state";
import {TransactionRepository} from "domain/transaction/repository";
import {Transaction} from "domain/transaction/transaction";
import {EntityId} from "domain/_core";

@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {
    constructor(private readonly realmService: RealmService) {}

    create(transaction: Transaction): Transaction {
        const realm = this.realmService.realm;

        let id: BSON.ObjectId = new BSON.ObjectId();
        realm.write(() => {
            const obj = realm.create('Transaction', {
                _id: id,
                choices: transaction.choices,
                customQueries: transaction.customQueries,
                inputText: transaction.inputText,
                stats: transaction.stats,
                status: transaction.status,
                requestedAt: transaction.requestedAt,
                createdAt: transaction.createdAt,
            });
            transaction.id = new EntityId(id.toString())
        });

        return transaction
    }

    markSuccess(params: {
        id: BSON.ObjectId;
        finalText: string;
        stats: object;
    }) {
        const realm = this.realmService.realm;
        realm.write(() => {
            const obj = realm.objectForPrimaryKey(
                TransactionRealm,
                params.id,
            );
            if (!obj) return;

            obj.finalText = params.finalText;
            obj.stats = params.stats;
            obj.status = TransactionStatus.Finished;
            obj.processedAt = new Date();
        });
    }

    markFailure(params: { id: BSON.ObjectId; errorMessage: string }) {
        const realm = this.realmService.realm;
        realm.write(() => {
            const obj = realm.objectForPrimaryKey(
                TransactionRealm,
                params.id,
            );
            if (!obj) return;

            obj.status = TransactionStatus.Failed;
            obj.errorMessage = params.errorMessage;
            obj.processedAt = new Date();
        });
    }
}
