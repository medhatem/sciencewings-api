import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Member } from '@/modules/hr/models/Member';
import { MemberDTO } from '../dtos/MemberDTO';
import { CreateMemberRO } from './RequestObject';
import { IMemberService } from '@/modules/hr/interfaces';
export declare class MemberRoutes extends BaseRoutes<Member> {
    private memberService;
    constructor(memberService: IMemberService);
    static getInstance(): MemberRoutes;
    createMember(payload: CreateMemberRO): Promise<MemberDTO>;
    createUpdateMember(payload: CreateMemberRO, id: number): Promise<MemberDTO>;
}
