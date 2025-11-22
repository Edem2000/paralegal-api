import {BaseEntity, BaseModel} from "domain/_core";
import {TransactionStatus} from "domain/transaction/transaction-state";

export interface TransactionModel extends BaseModel {
    choices: string[],
    customQueries: string[],

    inputText: string,
    finalText?: string,
    stats: object,
    status: TransactionStatus,
    errorMessage?: string,

    requestedAt: Date,
    processedAt?: Date,
    createdAt: Date,
}

export class Transaction extends BaseEntity<TransactionModel> {
    public get choices(): string[] {
        return this.model.choices;
    }

    public set choices(value: string[]) {
        this.model.choices = value;
    }

    public get customQueries(): string[] {
        return this.model.customQueries;
    }

    public set customQueries(value: string[]) {
        this.model.customQueries = value;
    }

    public get inputText(): string {
        return this.model.inputText;
    }

    public set inputText(value: string) {
        this.model.inputText = value;
    }

    public get finalText(): string | undefined {
        return this.model.finalText;
    }

    public set finalText(value: string) {
        this.model.finalText = value;
    }

    public get stats(): object {
        return this.model.stats;
    }

    public set stats(value: object) {
        this.model.stats = value;
    }

    public get status(): TransactionStatus {
        return this.model.status;
    }

    public set status(value: TransactionStatus) {
        this.model.status = value;
    }

    public get errorMessage(): string | undefined {
        return this.model.errorMessage;
    }

    public set errorMessage(value: string) {
        this.model.errorMessage = value;
    }

    public get requestedAt(): Date {
        return this.model.requestedAt;
    }

    public set requestedAt(value: Date) {
        this.model.requestedAt = value;
    }

    public get processedAt(): Date | undefined {
        return this.model.processedAt;
    }

    public set processedAt(value: Date) {
        this.model.processedAt = value;
    }

    public get createdAt(): Date {
        return this.model.createdAt;
    }

    public set createdAt(value: Date) {
        this.model.createdAt = value;
    }
}
