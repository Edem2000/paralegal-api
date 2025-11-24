import {Injectable} from "@nestjs/common";
import {RealmService} from "data/mongo";
import {BSON} from "realm";
import {ChangeRepository} from "domain/change/repository";
import {Change} from "domain/change/change";
import {EntityId, Identifier} from "domain/_core";
import {ChangeRealm} from "data/mongo/schemas/change-schema";
import {RunActor} from "domain/change/types";

@Injectable()
export class ChangeRepositoryImpl implements ChangeRepository {
    constructor(private readonly realmService: RealmService) {}

    public create(change: Change): Change {
        const realm = this.realmService.realm;

        let id: BSON.ObjectId = new BSON.ObjectId();
        this.realmService.realm.write(() => {
            const obj = realm.create('Change', {
                _id: id,
                transactionId: new BSON.ObjectId(change.transactionId?.toString()),
                runId: change.runId ? new BSON.ObjectId(change.runId.toString()) : undefined,
                actor: change.actor,
                kind: change.kind,
                before: change.before,
                after: change.after,
                start: change.start,
                end: change.end,
                contextBefore: change.contextBefore,
                contextAfter: change.contextAfter,
                confidence: change.confidence,
                resolution: change.resolution,
                createdAt: change.createdAt,
            });
            change.id = new EntityId(id.toString())
        });

        return change;
    }

    public getByTransactionId(transactionId: Identifier): Change[] {
        const realm = this.realmService.realm;

        const oid = new BSON.ObjectId(transactionId.toString());

        const results = realm
            .objects<ChangeRealm>(ChangeRealm.schema.name)
            .filtered('transactionId == $0', oid)
            .sorted('start');

        return results.map(this.mapChangeRealmToEntity);
    }

    private mapChangeRealmToEntity(doc: ChangeRealm): Change {
        return new Change({
            id: doc.id,
            createdAt: doc.createdAt,

            transactionId: new EntityId(doc.transactionId.toString()),

            actor: doc.actor as RunActor,
            kind: doc.kind,
            before: doc.before,
            after: doc.after,
            start: doc.start,
            end: doc.end,
            contextBefore: doc.contextBefore,
            contextAfter: doc.contextAfter,
            confidence: doc.confidence,
            resolution: doc.resolution,
        });
    }
}
