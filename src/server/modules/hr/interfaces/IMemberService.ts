import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@/utils/Result';
import { Member } from '@/modules/hr/models/Member';

export abstract class IMemberService extends IBaseService<any> {
  inviteUserByEmail: (email: string, orgId: number) => Promise<Result<Member>>;
  resendInvite: (id: number, orgId: number) => Promise<Result<number>>;
}
