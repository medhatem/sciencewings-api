import { container, provideSingleton } from '@di/index';
import { BaseRoutes } from '@modules/base/routes/BaseRoutes';
import { Organization } from '@modules/organizations/models/Organization';
import { Path, POST, Security, ContextRequest, GET, PathParam } from 'typescript-rest';
import { KEYCLOAK_TOKEN } from '../../../authenticators/constants';
import { CreateOrganizationRO, UserInviteToOrgRO } from './RequestObject';
import { UserRequest } from '../../../types/UserRequest';
import { OrganizationDTO } from '@modules/organizations/dtos/OrganizationDTO';
import { LoggerStorage } from '../../../decorators/loggerStorage';
import { Response } from 'typescript-rest-swagger';
import { UpdateOrganizationDTO } from '@modules/organizations/dtos/UpdateOrganizationDTO';
import { InviteUserDTO } from '@modules/organizations/dtos/InviteUserDTO';
import { IOrganizationService } from '../interfaces/IOrganizationService';

@provideSingleton()
@Path('organization')
export class OrganizationRoutes extends BaseRoutes<Organization> {
  constructor(private OrganizationService: IOrganizationService) {
    super(OrganizationService as any, OrganizationDTO, UpdateOrganizationDTO);
  }

  static getInstance(): OrganizationRoutes {
    return container.get(OrganizationRoutes);
  }

  @POST
  @Path('createOrganization')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async createOrganization(
    payload: CreateOrganizationRO,
    @ContextRequest request: UserRequest,
  ): Promise<OrganizationDTO> {
    const result = await this.OrganizationService.createOrganization(payload, request.userId);

    if (result.isFailure) {
      return new OrganizationDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new OrganizationDTO().serialize({ body: { createdOrgId: result.getValue(), statusCode: 201 } });
  }

  /**
   * invite a user to an organization
   * creates the newly invited user in keycloak
   *
   * @param payload
   */
  @POST
  @Path('inviteUserToOrganization')
  @Response<InviteUserDTO>(201, 'User Registred Successfully')
  @Security([], KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async inviteUserToOrganization(payload: UserInviteToOrgRO): Promise<InviteUserDTO> {
    const result = await this.OrganizationService.inviteUserByEmail(payload.email, payload.organizationId);

    if (result.isFailure) {
      return new InviteUserDTO().serialize({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new InviteUserDTO().serialize({
      body: { statusCode: 201, userId: result.getValue() },
    });
  }

  /**
   * retrive users that belongs to an organization
   *
   * @param id: organization id
   */
  @GET
  @Path('getMembers/:id')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async getUsers(@PathParam('id') payload: number) {
    const result = await this.OrganizationService.getMembers(payload);

    if (result.isFailure) {
      return new OrganizationDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new OrganizationDTO().serialize({ body: { members: result.getValue(), statusCode: 201 } });
  }

  /**
   * retrieve all the organizations a given user is a member of
   *
   * @param id: user id
   */
  @GET
  @Path('getUserOrganizations/:id')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async getUserOrganizations(@PathParam('id') payload: number) {
    const result = await this.OrganizationService.getUserOrganizations(payload);

    if (result.isFailure) {
      return new OrganizationDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new OrganizationDTO().serialize({ body: { organizations: result.getValue(), statusCode: 201 } });
  }
}
