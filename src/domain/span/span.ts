import {BaseEntity, BaseModel} from "domain/_core";
import type {RunActor} from "domain/change/types";
import {RuleKind} from "domain/_processor/rules/kind";

export interface SpanModel extends BaseModel {
    kind: RuleKind;
    start: number,
    end: number,
    before: string,
    after: string,
    actor: RunActor,

    confidence?: number,
}

export class Span extends BaseEntity<SpanModel> {

    public get actor(): RunActor {
        return this.model.actor;
    }

    public set actor(value: RunActor) {
        this.model.actor = value;
    }

    public get kind(): RuleKind {
        return this.model.kind;
    }

    public set kind(value: RuleKind) {
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

    public get confidence(): number | undefined {
        return this.model.confidence;
    }

    public set confidence(value: number) {
        this.model.confidence = value;
    }
}