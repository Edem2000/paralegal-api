import {Change} from "domain/change/change";
import {Identifier} from "domain/_core";

export interface ChangeRepository {
    create(change: Change): Change;
    getByTransactionId(transactionId: Identifier): Change[];
}