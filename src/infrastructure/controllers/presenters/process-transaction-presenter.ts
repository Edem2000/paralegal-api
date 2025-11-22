import {ProcessTransactionUsecaseResult} from "usecases/process-transaction-usecase";
import {ChangePresenter, ChangeResponseDto} from "infrastructure/controllers/presenters/change-presenter";

export class ProcessTransactionPresenter {
    public static present(data: ProcessTransactionUsecaseResult): ProcessTransactionResponseDto {
        return {
            finalText: data.finalText,
            changes: data.changes.map(change => ChangePresenter.present(change)),
        };
    }
}

export type ProcessTransactionResponseDto = {
    finalText: string,
    changes: ChangeResponseDto[],
};