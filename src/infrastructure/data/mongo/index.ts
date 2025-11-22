import {TransactionRealm} from "data/mongo/schemas/transaction-schema";
import {Injectable, OnModuleDestroy} from "@nestjs/common";
import {ChangeRealm} from "data/mongo/schemas/change-schema";
import Realm from "realm"

@Injectable()
export class RealmService implements OnModuleDestroy {
    private readonly _realm: Realm;

    constructor() {
        // Открываем БД сразу, синхронно
        this._realm = new Realm({
            path: 'paralegal.realm',
            schema: [TransactionRealm, ChangeRealm],
        });
    }

    get realm(): Realm {
        return this._realm;
    }

    onModuleDestroy() {
        if (this._realm && !this._realm.isClosed) {
            this._realm.close();
        }
    }
}

export * from './utils/identifier';
export * from './mongoose-repository';
export * from './repository';
