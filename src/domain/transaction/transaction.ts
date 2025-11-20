import {BaseEntity, BaseModel} from "domain/_core";
import {TransactionStatus} from "domain/transaction/transaction-state";

export interface TransactionModel extends BaseModel {
    choices: string[],
    customQueries: string[],

    inputText: string,
    finalText: string,
    stats: object,
    status: TransactionStatus,
    errorMessage: string,

    requestedAt: Date,
    processedAt: Date,
    createdAt: Date,
}

export class Transaction extends BaseEntity<TransactionModel> {

}
