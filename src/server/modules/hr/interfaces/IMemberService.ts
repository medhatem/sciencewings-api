import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Member } from '@/modules/hr/models/Member';
import { MemberKey } from '@/types/types';
import { MemberRO } from '@/modules/hr/routes/RequestObject';
import { Organization } from '@/modules/organizations/models/Organization';
import { UserInviteToOrgRO } from '@/modules/organizations/routes/RequestObject';

export abstract class IMemberService extends IBaseService<any> {
  inviteUserByEmail: (payload: UserInviteToOrgRO) => Promise<Member>;
  resendInvite: (id: number, orgId: number) => Promise<number>;
  switchOrganization: (orgId: number, userId: number) => Promise<number>;
  updateMembershipStatus: (payload: MemberRO, userId: number, orgId: number) => Promise<MemberKey>;
  getUserMemberships: (userId: number) => Promise<Organization[]>;
  getMemberProfile: (payload: { [key: string]: any }) => Promise<Member>;
  updateMemberByUserIdAndOrgId: (memberIds: { [key: string]: any }, payload: { [key: string]: any }) => Promise<number>;
}
