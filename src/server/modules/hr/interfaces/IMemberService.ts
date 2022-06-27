import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@/utils/Result';
import { MemberRO } from '@/modules/hr/routes/RequestObject';
import { MemberKey } from '@/types/types';
import { Member } from '@/modules/hr/models/Member';

export abstract class IMemberService extends IBaseService<any> {
  inviteUserByEmail: (email: string, orgId: number) => Promise<Result<Member>>;
  resendInvite: (id: number, orgId: number) => Promise<Result<number>>;
  updateMembershipStatus: (payload: MemberRO, userId: number, orgId: number) => Promise<Result<MemberKey>>;
  getUserMemberships: (userId: number) => Promise<Result<Member[]>>;
}
