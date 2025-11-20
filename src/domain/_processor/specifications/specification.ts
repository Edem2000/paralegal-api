export interface Specification<T> {
    isSatisfiedBy(value: T): boolean;
}