import { CreateMemberRO } from '@/modules/hr/routes/RequestObject';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@utils/Result';
export declare abstract class IMemberService extends IBaseService<any> {
    createMember: (payload: CreateMemberRO) => Promise<Result<number>>;
    updateMember: (payload: CreateMemberRO, memberId: number) => Promise<Result<number>>;
}
