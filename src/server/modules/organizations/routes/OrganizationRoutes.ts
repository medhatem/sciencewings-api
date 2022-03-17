import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Organization } from '@/modules/organizations/models/Organization';
import { Path, POST, Security, ContextRequest, GET, PathParam } from 'typescript-rest';
import { KEYCLOAK_TOKEN } from '../../../authenticators/constants';
import { CreateOrganizationRO, UserInviteToOrgRO, UserResendPassword } from './RequestObject';
import { UserRequest } from '../../../types/UserRequest';
import { OrganizationDTO } from '@/modules/organizations/dtos/OrganizationDTO';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Response } from 'typescript-rest-swagger';
import { UpdateOrganizationDTO } from '@/modules/organizations/dtos/UpdateOrganizationDTO';
import { InviteUserDTO } from '@/modules/organizations/dtos/InviteUserDTO';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
<<<<<<< HEAD
import { UserIdDTO } from '@/modules/users/dtos/RegisterUserFromTokenDTO';
import { BaseErrorDTO } from '@/modules/base/dtos/BaseDTO';
=======
import { OrganizationMembersDTO } from '../dtos/GetOrganizationsMembersDTO';
>>>>>>> d2e1d689c879644c95481b86bcf4657517d1cacd

@provideSingleton()
@Path('organization')
export class OrganizationRoutes extends BaseRoutes<Organization> {
  constructor(private OrganizationService: IOrganizationService) {
    super(OrganizationService as any, new OrganizationDTO(), new UpdateOrganizationDTO());
  }

  static getInstance(): OrganizationRoutes {
    return container.get(OrganizationRoutes);
  }

  @POST
  @Path('createOrganization')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  @Response<OrganizationDTO>(201, 'Organization created Successfully')
  @Response<OrganizationDTO>(500, 'Internal Server Error')
  public async createOrganization(
    payload: CreateOrganizationRO,
    @ContextRequest request: UserRequest,
  ): Promise<OrganizationDTO> {
    const result = await this.OrganizationService.createOrganization(payload, request.userId);

    if (result.isFailure) {
      return new OrganizationDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new OrganizationDTO({ body: { id: result.getValue(), statusCode: 201 } });
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
  @Response<OrganizationDTO>(500, 'Internal Server Error')
  @Security([], KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async inviteUserToOrganization(payload: UserInviteToOrgRO): Promise<InviteUserDTO> {
    const result = await this.OrganizationService.inviteUserByEmail(payload.email, payload.organizationId);

    if (result.isFailure) {
      return new InviteUserDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new InviteUserDTO({
      body: { statusCode: 201, id: result.getValue() },
    });
  }

  /**
   * resend the reset password email to the invited user
   *
   * @param payload
   *
   */
  @POST
  @Path('resendInvite')
  @Response<UserIdDTO>(200, 'invite resent successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  @Security([], KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async resendInvite(payload: UserResendPassword): Promise<InviteUserDTO> {
    const result = await this.OrganizationService.resendInvite(payload.userId, payload.orgId);

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
  @Response<OrganizationMembersDTO>(200, 'Return organization members Successfully')
  @Response<OrganizationMembersDTO>(500, 'Internal Server Error')
  public async getUsers(@PathParam('id') payload: number): Promise<OrganizationMembersDTO> {
    const result = await this.OrganizationService.getMembers(payload);

    if (result.isFailure) {
      return new OrganizationMembersDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new OrganizationMembersDTO({ body: { members: result.getValue(), statusCode: 200 } });
  }

  /**
   * retrieve all the organizations owned by a given user
   *
   * @param id: user id
   */
  @GET
  @Path('getUserOrganizations/:id')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  @Response<OrganizationDTO>(200, 'Return Organization that the users belongs to, Successfully')
  @Response<OrganizationDTO>(500, 'Internal Server Error')
  public async getUserOrganizations(@PathParam('id') payload: number) {
    const result = await this.OrganizationService.getUserOrganizations(payload);

    if (result.isFailure) {
      return new OrganizationDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new OrganizationDTO({ body: { id: result.getValue(), statusCode: 200 } });
  }
}
