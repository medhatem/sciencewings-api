import { Group, GroupDAO, IGroupService } from '..';
import { BaseService } from '@/modules/base/services/BaseService';
export declare class GroupService extends BaseService<Group> implements IGroupService {
    dao: GroupDAO;
    constructor(dao: GroupDAO);
    static getInstance(): IGroupService;
}
