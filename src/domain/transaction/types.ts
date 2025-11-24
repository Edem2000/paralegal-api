import {Transaction, TransactionModel} from "domain/transaction/transaction";

export type CreateParams = Pick<TransactionModel, 'inputText' | 'choices' | 'customQueries'>

export type GetPaginatedResult = {
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}