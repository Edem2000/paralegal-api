import {Injectable} from "@nestjs/common";
import {RealmService} from "data/mongo";
import {BSON} from "realm";
import {TransactionRealm} from "data/mongo/schemas/transaction-schema";
import {TransactionStatus} from "domain/transaction/transaction-state";
import {TransactionRepository} from "domain/transaction/repository";
import {Transaction} from "domain/transaction/transaction";
import {EntityId, Identifier} from "domain/_core";
import {GetPaginatedResult} from "domain/transaction/types";

@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {
    constructor(private readonly realmService: RealmService) {
    }

    create(transaction: Transaction): Transaction {
        const realm = this.realmService.realm;

        let id: BSON.ObjectId = new BSON.ObjectId();
        realm.write(() => {
            const obj = realm.create('Transaction', {
                _id: id,
                choices: transaction.choices,
                llmChoices: transaction.llmChoices,
                customQueries: transaction.customQueries,
                inputText: transaction.inputText,
                stats: transaction.stats,
                status: transaction.status,
                requestedAt: transaction.requestedAt,
                createdAt: transaction.createdAt,
            });
            transaction.id = new EntityId(id.toString());
        });

        return transaction;
    }

    public get(page: number, limit: number): GetPaginatedResult {
        const realm = this.realmService.realm;

        const safePage = Math.max(1, Math.floor(page || 1));
        const safeLimit = Math.max(1, Math.floor(limit || 10));

        const all = realm
            .objects<TransactionRealm>(TransactionRealm.schema.name)
            .sorted('createdAt', true);

        const total = all.length;
        const pages = Math.max(1, Math.ceil(total / safeLimit));
        const offset = (safePage - 1) * safeLimit;

        // Если offset вышел за пределы — вернём пустой массив, но с корректными метаданными
        if (offset >= total) {
            return {
                transactions: [],
                total,
                page: safePage,
                limit: safeLimit,
                pages,
            };
        }

        const slice = all.slice(offset, offset + safeLimit);
        const transactions = slice.map((doc) => this.mapTransactionRealmToEntity(doc));

        return {
            transactions,
            total,
            page: safePage,
            limit: safeLimit,
            pages,
        };
    }

    public getById(id: Identifier | string): Transaction | null {
        const realm = this.realmService.realm;

        const oid = new BSON.ObjectId(id.toString());

        const doc = realm.objectForPrimaryKey(TransactionRealm, oid);
        if (!doc) return null;

        return this.mapTransactionRealmToEntity(doc);
    }

    writeSuccess(transaction: Transaction): void {
        const realm = this.realmService.realm;
        realm.write(() => {
            const oid = new BSON.ObjectId(transaction.id.toString());

            const obj = realm.objectForPrimaryKey(
                TransactionRealm,
                oid,
            );
            if (!obj) return;

            obj.finalText = transaction.finalText;
            obj.stats = transaction.stats;
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

    private mapTransactionRealmToEntity(
        doc: TransactionRealm,
    ): Transaction {
        return new Transaction({
            id: doc.id,

            choices: [...doc.choices],
            llmChoices: [...doc.llmChoices],
            customQueries: [...doc.customQueries],

            inputText: doc.inputText,
            finalText: doc.finalText,
            stats: (doc.stats ?? {}) as object,
            status: doc.status as TransactionStatus,
            errorMessage: doc.errorMessage,

            requestedAt: doc.requestedAt,
            processedAt: doc.processedAt,
            createdAt: doc.createdAt,
        });
    }
}
