import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { MemberRO } from '@/modules/hr/routes/RequestObject';
import { Result } from '@/utils/Result';

export abstract class IMemberService extends IBaseService<any> {
  createMember: (payload: MemberRO) => Promise<Result<number>>;
  updateMember: (payload: MemberRO, memberId: number) => Promise<Result<number>>;
}
