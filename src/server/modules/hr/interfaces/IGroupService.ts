import { GroupRO } from '@/modules/hr/routes/RequestObject';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';

export abstract class IGroupService extends IBaseService<any> {
  createGroup: (payload: GroupRO) => Promise<number>;
  updateGroup: (payload: GroupRO, groupId: number) => Promise<number>;
  getOrganizationGroup: (organizationId: number) => Promise<any>;
  deleteGroup: (groupId: number) => Promise<number>;
  addGroupMember: (memberUserId: number, groupId: number) => Promise<number>;
  deleteGroupMember: (UserID: number, groupId: number) => Promise<number>;
}
