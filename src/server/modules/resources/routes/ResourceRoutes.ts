import { UserRequest } from './../../../types/UserRequest';
import { KEYCLOAK_TOKEN } from './../../../authenticators/constants';
import { container, provideSingleton } from '@di/index';
import { ResourceService } from '../services/ResourceService';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { Resource } from '../models/Resource';
import { Path, GET, QueryParam, POST, Security, ContextRequest } from 'typescript-rest';
import { ResourceDTO } from '../dtos/ResourceDTO';
import { LoggerStorage } from 'server/decorators/loggerStorage';
import { CreateResourceRO } from './RequestObject';
import { CreateResourceDTO } from '../dtos/CreatedResourceDTO';

@provideSingleton()
@Path('organisation')
export class ResourceRoutes extends BaseRoutes<Resource, ResourceDTO> {
  constructor(private ResourceService: ResourceService) {
    super(ResourceService, ResourceDTO);
    console.log(this.ResourceService);
  }

  static getInstance(): ResourceRoutes {
    return container.get(ResourceRoutes);
  }

  @POST
  @Path('createResource')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async createOrganisation(
    payload: CreateResourceRO,
    @ContextRequest request: UserRequest,
  ): Promise<CreateResourceDTO> {
    const result = await this.ResourceService.createResource(payload, request.userId);

    if (result.isFailure) {
      return new CreateResourceDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreateResourceDTO().serialize({ body: { createdOrgId: result.getValue(), statusCode: 201 } });
  }
}
