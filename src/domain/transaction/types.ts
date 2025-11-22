import {TransactionModel} from "domain/transaction/transaction";

export type CreateParams = Pick<TransactionModel, 'inputText' | 'choices' | 'customQueries'>