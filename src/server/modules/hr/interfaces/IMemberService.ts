import { IBaseService } from '@modules/base/interfaces/IBaseService';
import { Result } from '@utils/Result';
import { CreateMemberRO } from '@modules/hr/routes/RequestObject';

export abstract class IMemberService extends IBaseService<any> {
  createMember: (payload: CreateMemberRO) => Promise<Result<number>>;
}
