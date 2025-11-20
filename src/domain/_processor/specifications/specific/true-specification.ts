import {Specification} from "domain/_processor/specifications";

export class TrueSpecification<T> implements Specification<T> {
    isSatisfiedBy(_value: T): boolean {
        return true;
    }
}