import { AssignOptions } from '@mikro-orm/core';
import { Result } from '@utils/Result';
export declare abstract class IBaseService<T> {
    static getInstance: () => any;
    get: (id: number) => Promise<any>;
    getAll: () => Promise<Result<any[]>>;
    create: (entry: T) => Promise<Result<any>>;
    update: (entry: T) => Promise<Result<any>>;
    remove: (id: number) => Promise<Result<number>>;
    getByCriteria: (criteria: {
        [key: string]: any;
    }) => Promise<T>;
    wrapEntity: (entity: T, payload: {
        [key: string]: any;
    }, options: boolean | AssignOptions) => T;
}
