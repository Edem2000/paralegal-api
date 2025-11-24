import {Usecase} from "domain/_core/base-domain/base-usecase";
import {TransactionService} from "domain/transaction/service";
import {Transaction} from "domain/transaction/transaction";
import {Identifier} from "domain/_core";
import {Change} from "domain/change/change";
import {ChangeService} from "domain/change/service";

type GetTransactionParams = {
    id: Identifier,
};

export type GetTransactionUsecaseResult = {
    transaction: Transaction,
    changes: Change[],
}

export interface GetTransactionUsecase extends Usecase<GetTransactionParams, GetTransactionUsecaseResult> {}

export class GetTransactionUsecaseImpl implements GetTransactionUsecase {
    constructor(
        private readonly transactionService: TransactionService,
        private readonly changeService: ChangeService,
    ) {}

    async execute(params: GetTransactionParams): Promise<GetTransactionUsecaseResult> {
        const {id} = params;

        const transaction = this.transactionService.getById(id);

        if(!transaction) {
            throw new Error(`Transaction with id ${id.toString()} not found`);
        }

        const changes = this.changeService.getByTransactionId(id);

        return {transaction, changes};
    }
}
