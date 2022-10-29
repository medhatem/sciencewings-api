import { GroupRO } from '@/modules/hr/routes/RequestObject';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { GroupsList } from '@/types/types';

export abstract class IGroupService extends IBaseService<any> {
  createGroup: (payload: GroupRO) => Promise<number>;
  updateGroup: (payload: GroupRO, groupId: number) => Promise<number>;
  getOrganizationGroup: (organizationId: number, page?: number, size?: number) => Promise<GroupsList>;
  deleteGroup: (groupId: number) => Promise<number>;
  addGroupMember: (userId: number, groupId: number) => Promise<number>;
  deleteGroupMember: (userId: number, groupId: number) => Promise<number>;
  getGroupMembers: (groupId: number) => Promise<any>;
}
