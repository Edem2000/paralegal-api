import {Transaction, TransactionModel} from "domain/transaction/transaction";
import {GetPaginatedResult} from "domain/transaction/types";

export interface TransactionRepository {
    create(data: TransactionModel): Transaction;
    get(page: number, limit: number): GetPaginatedResult;
}