import { BaseService } from '@/modules/base/services/BaseService';
import { Collection } from '@mikro-orm/core';
import { CreateOrganizationRO } from '../routes/RequestObject';
import { IOrganizationService } from '../interfaces/IOrganizationService';
import { Organization } from '@/modules/organizations/models/Organization';
import { OrganizationDao } from '../daos/OrganizationDao';
import { Result } from '@utils/Result';
import { User } from '@/modules/users/models/User';
import { Email } from '@utils/Email';
import { IPhoneService } from '@/modules/phones/interfaces/IPhoneService';
import { IAddressService } from '@/modules/address/interfaces/IAddressService';
import { IUserService } from '@/modules/users/interfaces';
import { IOrganizationLabelService } from '@/modules/organizations/interfaces/IOrganizationLabelService';
import { GetUserOrganizationDTO } from '../dtos/GetUserOrganizationDTO';
export declare class OrganizationService extends BaseService<Organization> implements IOrganizationService {
    dao: OrganizationDao;
    userService: IUserService;
    labelService: IOrganizationLabelService;
    adressService: IAddressService;
    phoneService: IPhoneService;
    emailService: Email;
    constructor(dao: OrganizationDao, userService: IUserService, labelService: IOrganizationLabelService, adressService: IAddressService, phoneService: IPhoneService, emailService: Email);
    static getInstance(): IOrganizationService;
    createOrganization(payload: CreateOrganizationRO, userId: number): Promise<Result<number>>;
    inviteUserByEmail(email: string, orgId: number): Promise<Result<number>>;
    getMembers(orgId: number): Promise<Result<Collection<User>>>;
    getUserOrganizations(userId: number): Promise<Result<GetUserOrganizationDTO[]>>;
}
