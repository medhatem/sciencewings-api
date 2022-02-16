import { AssignOptions } from '@mikro-orm/core';
import { BaseDao } from '../daos/BaseDao';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { IBaseService } from '../interfaces/IBaseService';
import { Keycloak } from '@sdks/keycloak';
import { Logger } from '@/modules/../utils/Logger';
import { Result } from '@utils/Result';
export declare class BaseService<T extends BaseModel<T>> implements IBaseService<any> {
    dao: BaseDao<T>;
    keycloak: Keycloak;
    logger: Logger;
    constructor(dao: BaseDao<T>, keycloak?: Keycloak);
    static getInstance(): void;
    get(id: number): Promise<Result<any>>;
    getAll(): Promise<Result<any[]>>;
    create(entry: T): Promise<Result<any>>;
    update(entry: T): Promise<Result<any>>;
    remove(id: number): Promise<Result<number>>;
    getByCriteria(criteria: {
        [key: string]: any;
    }): Promise<T>;
    /**
     * serialize a json object into an mikro-orm entity/model
     *
     * @param entity the entity/model to serialize on an return
     * @param payload the data to serialize
     * @param options for assign options
     *
     */
    wrapEntity(entity: T, payload: any, options?: boolean | AssignOptions): T;
}
