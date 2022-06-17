import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@/utils/Result';
import { MemberRO } from '@/modules/hr/routes/RequestObject';
export abstract class IMemberService extends IBaseService<any> {
  inviteUserByEmail: (email: string, orgId: number) => Promise<Result<number>>;
  resendInvite: (id: number, orgId: number) => Promise<Result<number>>;
  updateMembershipStatus: (payload: MemberRO, userId: number, orgId: number) => Promise<Result<any>>;
}
