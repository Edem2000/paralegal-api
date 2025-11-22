import {Injectable} from "@nestjs/common";
import {RealmService} from "data/mongo";
import {BSON} from "realm";
import {ChangeRepository} from "domain/change/repository";
import {Change} from "domain/change/change";
import {EntityId} from "domain/_core";

@Injectable()
export class ChangeRepositoryImpl implements ChangeRepository {
    constructor(private readonly realmService: RealmService) {}

    create(change: Change): Change {
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
}
