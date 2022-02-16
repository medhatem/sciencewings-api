import { CreateMemberRO, UpdateMemberRO } from '@/modules/hr/routes/RequestObject';
import { BaseService } from '@/modules/base/services/BaseService';
import { IAddressService } from '@/modules/address/interfaces/IAddressService';
import { IMemberService } from '..';
import { IOrganizationService } from '@/modules/organizations/interfaces';
import { IPhoneService } from '@/modules/phones/interfaces/IPhoneService';
import { IResourceService } from '@/modules/resources/interfaces';
import { Member } from '@/modules/hr/models/Member';
import { MemberDao } from '../daos/MemberDao';
import { Result } from '@utils/Result';
declare type MemberRO = CreateMemberRO | UpdateMemberRO;
export declare class MemberService extends BaseService<Member> implements IMemberService {
    dao: MemberDao;
    organizationService: IOrganizationService;
    addressService: IAddressService;
    phoneService: IPhoneService;
    resourceService: IResourceService;
    constructor(dao: MemberDao, organizationService: IOrganizationService, addressService: IAddressService, phoneService: IPhoneService, resourceService: IResourceService);
    static getInstance(): IMemberService;
    private checkEntitiesExistance;
    private handleAddressForMemeber;
    private handlePhonesForMemeber;
    createMember(payload: MemberRO): Promise<Result<number>>;
    updateMember(payload: MemberRO, memberId: number): Promise<Result<number>>;
}
export {};
