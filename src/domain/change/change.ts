import {BaseEntity, BaseModel, type Identifier} from "domain/_core";
import type {RunActor} from "domain/change/types";

type ValueDetails = {
    start: number,
    end: number,
    contextBefore: string,
    contextAfter: string,
};

export interface ChangeModel extends BaseModel {
    transactionId: Identifier;
    runId?: Identifier;
    actor: RunActor,
    kind: string,
    before: string,
    beforeDetails: ValueDetails,
    after: string,
    afterDetails: ValueDetails,

    confidence: number,
    resolution: string,

    createdAt: Date,
}

export class Change extends BaseEntity<ChangeModel> {
    public get transactionId(): Identifier {
        return this.model.transactionId;
    }

    public set transactionId(value: Identifier) {
        this.model.transactionId = value;
    }

    public get runId(): Identifier | undefined {
        return this.model.runId;
    }

    public set runId(value: Identifier) {
        this.model.runId = value;
    }

    public get actor(): RunActor {
        return this.model.actor;
    }

    public set actor(value: RunActor) {
        this.model.actor = value;
    }

    public get kind(): string {
        return this.model.kind;
    }

    public set kind(value: string) {
        this.model.kind = value;
    }

    public get before(): string {
        return this.model.before;
    }

    public set before(value: string) {
        this.model.before = value;
    }

    public get beforeDetails(): ValueDetails {
        return this.model.beforeDetails;
    }

    public set beforeDetails(value: ValueDetails) {
        this.model.beforeDetails = value;
    }

    public get after(): string {
        return this.model.after;
    }

    public set after(value: string) {
        this.model.after = value;
    }

    public get afterDetails(): ValueDetails {
        return this.model.afterDetails;
    }

    public set afterDetails(value: ValueDetails) {
        this.model.afterDetails = value;
    }

    public get confidence(): number {
        return this.model.confidence;
    }

    public set confidence(value: number) {
        this.model.confidence = value;
    }

    public get resolution(): string {
        return this.model.resolution;
    }

    public set resolution(value: string) {
        this.model.resolution = value;
    }

    public get createdAt(): Date {
        return this.model.createdAt;
    }

    public set createdAt(value: Date) {
        this.model.createdAt = value;
    }

}