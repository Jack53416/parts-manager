export interface Prototype<T> {
    copy(): T;
    apply(other: T): void;
}