import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@/utils/Result';
import { Member } from '../models';

export abstract class IMemberService extends IBaseService<any> {
  inviteUserByEmail: (email: string, orgId: number) => Promise<Result<number>>;
  resendInvite: (id: number, orgId: number) => Promise<Result<number>>;
  getUserMemberships: (userId: number) => Promise<Result<Member[]>>;
}
