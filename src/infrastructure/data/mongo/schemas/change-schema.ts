import Realm, {BSON} from 'realm';
import {EntityId, Identifier} from "domain/_core";

export class ChangeRealm extends Realm.Object<ChangeRealm> {
    _id!: BSON.ObjectId;
    transactionId!: BSON.ObjectId;
    runId!: BSON.ObjectId | null;
    actor!: string;
    kind!: string;
    before!: string;
    after!: string;
    start!: number;
    end!: number;
    contextBefore!: string;
    contextAfter!: string;

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
            after: 'string',
            start: 'int',
            end: 'int',
            contextBefore: 'string',
            contextAfter: 'string',
            confidence: 'double',
            resolution: 'string',
            createdAt: 'date',
        },
    };
}
