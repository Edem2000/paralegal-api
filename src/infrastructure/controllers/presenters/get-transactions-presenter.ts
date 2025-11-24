import {GetTransactionsUsecaseResult} from "usecases/get-transactions-usecase";
import {
    TransactionPresenter,
    TransactionResponseDto
} from "infrastructure/controllers/presenters/transaction-presenter";

export class GetTransactionsPresenter {
    public static present(data: GetTransactionsUsecaseResult): GetTransactionsResponseDto {
        return {
            total: data.total,
            page: data.page,
            limit: data.limit,
            pages: data.pages,
            transactions: data.transactions.map(transaction => TransactionPresenter.present(transaction)),
        };
    }
}

export type GetTransactionsResponseDto = {
    total: number,
    page: number,
    limit: number,
    pages: number,
    transactions: TransactionResponseDto[],
};