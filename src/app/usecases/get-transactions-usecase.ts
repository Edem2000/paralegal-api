import {Usecase} from "domain/_core/base-domain/base-usecase";
import {TransactionService} from "domain/transaction/service";
import {Transaction} from "domain/transaction/transaction";

type GetTransactionsParams = {
    page: number,
    limit: number,
};

export type GetTransactionsUsecaseResult = {
    total: number,
    page: number,
    limit: number,
    pages: number,
    transactions: Transaction[],
}

export interface GetTransactionsUsecase extends Usecase<GetTransactionsParams, GetTransactionsUsecaseResult> {}

export class GetTransactionsUsecaseImpl implements GetTransactionsUsecase {
    constructor(
        private readonly transactionService: TransactionService,
    ) {}

    async execute(params: GetTransactionsParams): Promise<GetTransactionsUsecaseResult> {
        const {page, limit} = params;

        return this.transactionService.get(page, limit);
    }
}
