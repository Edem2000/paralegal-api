import Realm, {BSON} from 'realm';
import {EntityId, Identifier} from "domain/_core";

export class TransactionRealm extends Realm.Object<TransactionRealm> {
    _id!: BSON.ObjectId;
    choices!: string[];
    customQueries!: string[];

    inputText!: string;
    finalText?: string;
    stats!: Realm.Mixed;
    status!: string;
    errorMessage!: string;

    requestedAt!: Date;
    processedAt!: Date;
    createdAt!: Date;

    get id(): Identifier {
        return new EntityId(this._id.toString());
    }

    set id(val: Identifier) {
        this._id = new BSON.ObjectId(val.toString());
    }

    static schema: Realm.ObjectSchema = {
        name: 'Transaction',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            choices: 'string[]',
            customQueries: 'string[]',

            inputText: 'string',
            finalText: 'string?',
            stats: 'mixed',
            status: 'string',
            errorMessage: 'string?',

            requestedAt: 'date',
            processedAt: 'date?',
            createdAt: 'date',
        },
    };
}
