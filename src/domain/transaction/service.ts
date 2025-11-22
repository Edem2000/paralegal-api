import {Transaction} from "domain/transaction/transaction";
import {CreateParams} from "domain/transaction/types";
import {TransactionStatus} from "domain/transaction/transaction-state";
import {TransactionRepository} from "domain/transaction/repository";

export interface TransactionService {
    create(data: CreateParams): Transaction
}

export class TransactionServiceImpl implements TransactionService {
    constructor(private readonly repository: TransactionRepository) {}

    public create(data: CreateParams): Transaction {
        const transaction = new Transaction({
            ...data,
            stats: {},
            status: TransactionStatus.Pending,
            requestedAt: new Date(),
            createdAt: new Date(),
        });

        console.log(this.repository.create(transaction));

        return transaction;
    }
}