import { UserInviteToOrgRO } from '@modules/organisations/routes/RequestObject';
import { InviteUserDTO } from '../dtos/InviteUserDTO';
import { container, provideSingleton } from '@di/index';
import { OrganisationService } from '../services/OrganisationService';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { Organization } from '../models/Organization';
import { Path, POST, Security, ContextRequest, GET, PathParam } from 'typescript-rest';
import { KEYCLOAK_TOKEN } from '../../../authenticators/constants';
import { CreateOrganizationRO } from './RequestObject';
import { UserRequest } from '../../../types/UserRequest';
import { CreatedOrganizationDTO } from '../dtos/createdOrganizationDTO';
import { OrganizationDTO } from '../dtos/OrganizationDTO';
import { LoggerStorage } from '../../../decorators/loggerStorage';
import { Response } from 'typescript-rest-swagger';

@provideSingleton()
@Path('organisation')
export class OrganizationRoutes extends BaseRoutes<Organization, OrganizationDTO> {
  constructor(private OrganisationService: OrganisationService) {
    super(OrganisationService, OrganizationDTO);
  }

  static getInstance(): OrganizationRoutes {
    return container.get(OrganizationRoutes);
  }

  @POST
  @Path('createOrganisation')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async createOrganisation(
    payload: CreateOrganizationRO,
    @ContextRequest request: UserRequest,
  ): Promise<CreatedOrganizationDTO> {
    const result = await this.OrganisationService.createOrganization(payload, request.userId);

    if (result.isFailure) {
      return new CreatedOrganizationDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreatedOrganizationDTO().serialize({ body: { createdOrgId: result.getValue(), statusCode: 201 } });
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
    const result = await this.OrganisationService.inviteUserByEmail(payload.email, payload.organizationId);

    if (result.isFailure) {
      return new InviteUserDTO().serialize({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new InviteUserDTO().serialize({
      body: { statusCode: 201, userId: result.getValue() },
    });
  }
  @GET
  @Path('getMembers/:id')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async getUsers(@PathParam('id') payload: number) {
    const result = await this.OrganisationService.getMembers(payload);

    if (result.isFailure) {
      return new CreatedOrganizationDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreatedOrganizationDTO().serialize({ body: { members: result.getValue(), statusCode: 201 } });
  }
}
