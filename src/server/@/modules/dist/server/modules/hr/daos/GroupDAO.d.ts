import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Group } from '..';
export declare class GroupDAO extends BaseDao<Group> {
    model: Group;
    private constructor();
    static getInstance(): GroupDAO;
}
