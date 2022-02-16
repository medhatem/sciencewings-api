import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Member } from '@/modules/hr/models/Member';
export declare class MemberDao extends BaseDao<Member> {
    model: Member;
    private constructor();
    static getInstance(): MemberDao;
}
