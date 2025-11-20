import {BaseEntity, BaseModel, type Identifier} from "domain/_core";
import type {RunActor} from "domain/change/types";

export interface ChangeModel extends BaseModel {
    transactionId: Identifier;
    runId: Identifier;
    actor: RunActor,
    kind: string,
    before: string,
    after: string,
    start: number,
    end: number,
    contextBefore: string,
    contextAfter: string,

    confidence: number,
    resolution: string,

    createdAt: Date,
}

export class Change extends BaseEntity<ChangeModel> {

}