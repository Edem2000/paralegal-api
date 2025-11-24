import {GetTransactionUsecaseResult} from "usecases/get-transaction-usecase";
import {
    TransactionPresenter,
    TransactionResponseDto
} from "infrastructure/controllers/presenters/transaction-presenter";
import {ChangePresenter, ChangeResponseDto} from "infrastructure/controllers/presenters/change-presenter";

export class GetTransactionPresenter {
    public static present(data: GetTransactionUsecaseResult): GetTransactionResponseDto {
        return {
            transaction: TransactionPresenter.present(data.transaction),
            changes: data.changes.map(change => ChangePresenter.present(change)),
        };
    }
}

export type GetTransactionResponseDto = {
    transaction: TransactionResponseDto,
    changes: ChangeResponseDto[],
};