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

  @GET
  @Path('getUsers/:id')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async getUsers(@PathParam('id') payload: number) {
    const result = await this.OrganisationService.getUsers(payload);

    if (result.isFailure) {
      return new CreatedOrganizationDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreatedOrganizationDTO().serialize({ body: { members: result.getValue(), statusCode: 201 } });
  }
}
