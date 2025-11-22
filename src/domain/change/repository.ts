import {Change} from "domain/change/change";

export interface ChangeRepository {
    create(change: Change): Change;
}