import { EntityRepository, GetRepository } from '@mikro-orm/core';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Logger } from '@/modules/../utils/Logger';
export declare class BaseDao<T extends BaseModel<T>> {
    model: T;
    repository: GetRepository<T, EntityRepository<T>>;
    logger: Logger;
    constructor(model: T);
    static getInstance(): void;
    get(id: number): Promise<T>;
    /**
     * fetches using a given search criteria
     *
     * @param criteria the criteria to fetch with
     */
    getByCriteria(criteria: {
        [key: string]: any;
    }): Promise<T>;
    getAll(): Promise<T[]>;
    create(entry: T): Promise<T>;
    update(entry: T): Promise<T>;
    remove(entry: T): Promise<T>;
}
