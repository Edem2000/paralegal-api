import {BaseEntity, BaseModel, Identifier} from "domain/_core";
import {RunActor} from "domain/run/types";

export interface RunModel extends BaseModel {
    transactionId: Identifier;
    actor: RunActor,
    startedAt: Date,
    finishedAt: Date,
    llmModel: string,
    prompt: string,
    settings: object,
    summary: object,
}

export class Run extends BaseEntity<RunModel> {
    public get transactionId(): Identifier {
        return this.model.transactionId;
    }

    public set transactionId(value: Identifier) {
        this.model.transactionId = value;
    }

    public get actor(): RunActor {
        return this.model.actor;
    }

    public set actor(value: RunActor) {
        this.model.actor = value;
    }

    public get startedAt(): Date {
        return this.model.startedAt;
    }

    public set startedAt(value: Date) {
        this.model.startedAt = value;
    }

    public get finishedAt(): Date {
        return this.model.finishedAt;
    }

    public set finishedAt(value: Date) {
        this.model.finishedAt = value;
    }

    public get llmModel(): string {
        return this.model.llmModel;
    }

    public set llmModel(value: string) {
        this.model.llmModel = value;
    }

    public get prompt(): string {
        return this.model.prompt;
    }

    public set prompt(value: string) {
        this.model.prompt = value;
    }

    public get settings(): object {
        return this.model.settings;
    }

    public set settings(value: object) {
        this.model.settings = value;
    }

    public get summary(): object {
        return this.model.summary;
    }

    public set summary(value: object) {
        this.model.summary = value;
    }
}