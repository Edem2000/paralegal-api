import {BaseEntity, BaseModel, Identifier} from "domain/_core";
import {RunActor} from "domain/run/types";

export interface RunModel extends BaseModel {
    transactionId: Identifier;
    actor: RunActor,
    startedAt: Date,
    finishedAt: Date,
    model: string,
    prompt: string,
    settings: object,
    summary: object,
}

export class Run extends BaseEntity<RunModel> {

}