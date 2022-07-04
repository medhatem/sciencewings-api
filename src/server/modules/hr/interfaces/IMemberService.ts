import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Member } from '@/modules/hr/models/Member';
import { MemberKey } from '@/types/types';
import { MemberRO } from '@/modules/hr/routes/RequestObject';
import { Organization } from '@/modules/organizations/models/Organization';
import { Result } from '@/utils/Result';

export abstract class IMemberService extends IBaseService<any> {
  inviteUserByEmail: (email: string, orgId: number) => Promise<Result<Member>>;
  resendInvite: (id: number, orgId: number) => Promise<Result<number>>;
  switchOrganization: (orgId: number, userId: number) => Promise<Result<number>>;
  updateMembershipStatus: (payload: MemberRO, userId: number, orgId: number) => Promise<Result<MemberKey>>;
  getUserMemberships: (userId: number) => Promise<Result<Organization[]>>;
}
