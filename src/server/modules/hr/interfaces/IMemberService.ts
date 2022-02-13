import { IBaseService } from '../../base/interfaces/IBaseService';
import { Result } from '@utils/Result';
import { CreateMemberRO } from '../../hr/routes/RequestObject';

export abstract class IMemberService extends IBaseService<any> {
  createMember: (payload: CreateMemberRO) => Promise<Result<number>>;
  updateMember: (payload: CreateMemberRO, memberId: number) => Promise<Result<number>>;
}
