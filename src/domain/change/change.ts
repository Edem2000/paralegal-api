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
    public get transactionId(): Identifier {
        return this.model.transactionId;
    }

    public set transactionId(value: Identifier) {
        this.model.transactionId = value;
    }

    public get runId(): Identifier {
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

    public get after(): string {
        return this.model.after;
    }

    public set after(value: string) {
        this.model.after = value;
    }

    public get start(): number {
        return this.model.start;
    }

    public set start(value: number) {
        this.model.start = value;
    }

    public get end(): number {
        return this.model.end;
    }

    public set end(value: number) {
        this.model.end = value;
    }

    public get contextBefore(): string {
        return this.model.contextBefore;
    }

    public set contextBefore(value: string) {
        this.model.contextBefore = value;
    }

    public get contextAfter(): string {
        return this.model.contextAfter;
    }

    public set contextAfter(value: string) {
        this.model.contextAfter = value;
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