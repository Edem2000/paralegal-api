import {Transaction, TransactionModel} from "domain/transaction/transaction";

export interface TransactionRepository {
    create(data: TransactionModel): Transaction;
}