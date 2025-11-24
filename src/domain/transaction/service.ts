import {Transaction} from "domain/transaction/transaction";
import {CreateParams, GetPaginatedResult} from "domain/transaction/types";
import {TransactionStatus} from "domain/transaction/transaction-state";
import {TransactionRepository} from "domain/transaction/repository";
import {Identifier} from "domain/_core";

export interface TransactionService {
    create(data: CreateParams): Transaction,
    get(page: number, limit: number): GetPaginatedResult;
    getById(id: Identifier | string): Transaction | null;
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

    public get(page: number, limit: number): GetPaginatedResult {
        return this.repository.get(page, limit);
    }

    public getById(id: Identifier | string): Transaction | null {
        return this.repository.getById(id);
    }
}