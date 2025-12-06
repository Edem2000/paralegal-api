import {Transaction} from "domain/transaction/transaction";
import {HexString} from "domain/_core";

export class TransactionPresenter {
    public static present(transaction: Transaction): TransactionResponseDto {
        return {
            id: transaction.id.toString(),
            choices: transaction.choices,
            llmChoices: transaction.llmChoices,
            customQueries: transaction.customQueries,
            inputText: transaction.inputText,
            finalText: transaction.finalText!,
            stats: transaction.stats,
            status: transaction.status,
            errorMessage: transaction.errorMessage,
            requestedAt: transaction.requestedAt.toISOString(),
            processedAt: transaction.processedAt?.toISOString(),
            createdAt: transaction.createdAt.toISOString(),
        };
    }
}

export type TransactionResponseDto = {
    id: HexString;
    choices: string[],
    llmChoices: string[],
    customQueries: string[],
    inputText: string,
    finalText: string,
    stats: object,
    status: string,
    errorMessage?: string,
    requestedAt: string,
    processedAt?: string,
    createdAt: string,
};