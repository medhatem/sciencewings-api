import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Organization } from '@/modules/organizations/models/Organization';
import { CreateOrganizationRO, UserInviteToOrgRO } from './RequestObject';
import { UserRequest } from '@/modules/../types/UserRequest';
import { OrganizationDTO } from '@/modules/organizations/dtos/OrganizationDTO';
import { InviteUserDTO } from '@/modules/organizations/dtos/InviteUserDTO';
import { IOrganizationService } from '../interfaces/IOrganizationService';
export declare class OrganizationRoutes extends BaseRoutes<Organization> {
    private OrganizationService;
    constructor(OrganizationService: IOrganizationService);
    static getInstance(): OrganizationRoutes;
    createOrganization(payload: CreateOrganizationRO, request: UserRequest): Promise<OrganizationDTO>;
    /**
     * invite a user to an organization
     * creates the newly invited user in keycloak
     *
     * @param payload
     */
    inviteUserToOrganization(payload: UserInviteToOrgRO): Promise<InviteUserDTO>;
    /**
     * retrive users that belongs to an organization
     *
     * @param id: organization id
     */
    getUsers(payload: number): Promise<OrganizationDTO>;
    /**
     * retrieve all the organizations a given user is a member of
     *
     * @param id: user id
     */
    getUserOrganizations(payload: number): Promise<OrganizationDTO>;
}
