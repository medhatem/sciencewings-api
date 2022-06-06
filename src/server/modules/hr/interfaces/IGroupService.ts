import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@/utils/Result';
import { GroupRO } from '@/modules/hr/routes/RequestObject';

export abstract class IGroupService extends IBaseService<any> {
  createGroup: (payload: GroupRO) => Promise<Result<number>>;
  updateGroup: (payload: GroupRO, groupId: number) => Promise<Result<number>>;
  getOrganizationGroup: (organizationId: number) => Promise<Result<any>>;
  deleteGroup: (groupId: number) => Promise<Result<number>>;
  addGroupMember: (member: any, groupId: number) => Promise<Result<number>>;
  deleteGroupMember: (member: any, groupId: number) => Promise<Result<number>>;
}
