import Realm, {BSON} from 'realm';
import {EntityId, Identifier} from "domain/_core";

export class ChangeRealm extends Realm.Object<ChangeRealm> {
    _id!: BSON.ObjectId;
    transactionId!: BSON.ObjectId;
    runId!: BSON.ObjectId | null;
    actor!: string;
    kind!: string;
    before!: string;
    beforeDetails!: ValueDetails;

    after!: string;
    afterDetails!: ValueDetails;

    confidence!: number;
    resolution!: string;
    createdAt!: Date;


    get id(): Identifier {
        return new EntityId(this._id.toString());
    }

    set id(val: Identifier) {
        this._id = new BSON.ObjectId(val.toString());
    }

    static schema: Realm.ObjectSchema = {
        name: 'Change',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            transactionId: 'objectId',
            runId: 'objectId?',
            actor: 'string',
            kind: 'string',
            before: 'string',
            beforeDetails: "ValueDetails",
            after: "string",
            afterDetails: "ValueDetails",
            confidence: 'double',
            resolution: 'string',
            createdAt: 'date',
        },
    };
}

export class ValueDetails extends Realm.Object<ValueDetails> {
    start!: number;
    end!: number;
    contextBefore!: string;
    contextAfter!: string;

    static schema: Realm.ObjectSchema = {
        name: "ValueDetails",
        embedded: true, // важно: embedded, а не отдельная таблица
        properties: {
            start: "int",
            end: "int",
            contextBefore: "string",
            contextAfter: "string",
        },
    };
}
