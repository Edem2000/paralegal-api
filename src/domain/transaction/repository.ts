import {Transaction, TransactionModel} from "domain/transaction/transaction";
import {GetPaginatedResult} from "domain/transaction/types";
import {Identifier} from "domain/_core";

export interface TransactionRepository {
    create(data: TransactionModel): Transaction;
    get(page: number, limit: number): GetPaginatedResult;
    getById(id: Identifier | string): Transaction | null;
}