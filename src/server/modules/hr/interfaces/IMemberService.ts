import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@/utils/Result';
import { Member } from '@/modules/hr/models/Member';

export abstract class IMemberService extends IBaseService<any> {
  inviteUserByEmail: (email: string, orgId: number) => Promise<Result<number>>;
  resendInvite: (id: number, orgId: number) => Promise<Result<number>>;
<<<<<<< HEAD
  switchOrganization: (orgId: number, userId: number) => Promise<Result<number>>;
=======
  getUserMemberships: (userId: number) => Promise<Result<Member[]>>;
>>>>>>> 1d2bd3375e45231a2f11e3fd1bc974908ec2a6ac
}
