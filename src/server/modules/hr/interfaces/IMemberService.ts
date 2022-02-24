import { IBaseService } from '../../base/interfaces/IBaseService';
import { Result } from '@utils/Result';
import { MemberRO } from '../../hr/routes/RequestObject';

export abstract class IMemberService extends IBaseService<any> {
  createMember: (payload: MemberRO) => Promise<Result<number>>;
  updateMember: (payload: MemberRO, memberId: number) => Promise<Result<number>>;
}
