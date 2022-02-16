import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Resource } from '@/modules/resources/models/Resource';
export declare class ResourceDao extends BaseDao<Resource> {
    model: Resource;
    private constructor();
    static getInstance(): ResourceDao;
}
