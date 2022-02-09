import { container, provideSingleton } from '@di/index';
import { OrganizationService } from '../services/OrganizationService';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { Organization } from '../models/Organization';
import { Path, POST, Security, ContextRequest, GET, PathParam } from 'typescript-rest';
import { KEYCLOAK_TOKEN } from '../../../authenticators/constants';
import { CreateOrganizationRO } from './RequestObject';
import { UserRequest } from '../../../types/UserRequest';
import { CreatedOrganizationDTO } from '../dtos/createdOrganizationDTO';
import { OrganizationDTO } from '../dtos/OrganizationDTO';
import { LoggerStorage } from '../../../decorators/loggerStorage';
import { UpdateOrganizationDTO } from '../dtos/UpdateOrganizationDTO';

@provideSingleton()
@Path('organization')
export class OrganizationRoutes extends BaseRoutes<Organization> {
  constructor(private OrganizationService: OrganizationService) {
    super(OrganizationService, OrganizationDTO, UpdateOrganizationDTO);
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
  ): Promise<CreatedOrganizationDTO> {
    const result = await this.OrganizationService.createOrganization(payload, request.userId);

    if (result.isFailure) {
      return new CreatedOrganizationDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreatedOrganizationDTO().serialize({ body: { createdOrgId: result.getValue(), statusCode: 201 } });
  }

  @GET
  @Path('getMembers/:id')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async getUsers(@PathParam('id') payload: number) {
    const result = await this.OrganizationService.getMembers(payload);

    if (result.isFailure) {
      return new CreatedOrganizationDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreatedOrganizationDTO().serialize({ body: { members: result.getValue(), statusCode: 201 } });
  }
}
