import { Logger } from './Logger';
export declare class Result<T> {
    isSuccess: boolean;
    isFailure: boolean;
    error: string;
    private _value;
    logger: Logger;
    private constructor();
    getValue(): T;
    static ok<U>(value?: U): Result<U>;
    static fail<U>(error: string): Result<U>;
    static combine(results: Result<any>[]): Result<any>;
}
