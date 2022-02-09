import { KEYCLOAK_TOKEN } from './../../../authenticators/constants';
import { container, provideSingleton } from '@di/index';
import { ResourceService } from '../services/ResourceService';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { Resource } from '../models/Resource';
import { Path, POST, Security } from 'typescript-rest';
import { ResourceDTO } from '../dtos/ResourceDTO';
import { UpdateResourceDTO } from '../dtos/UpdateResourceDTO';
import { CreateResourceDTO } from '../dtos/CreatedResourceDTO';
import { CreateResourceRO } from './RequestObject';
import { LoggerStorage } from 'server/decorators/loggerStorage';

@provideSingleton()
@Path('organization')
export class ResourceRoutes extends BaseRoutes<Resource> {
  constructor(private ResourceService: ResourceService) {
    super(ResourceService, ResourceDTO, UpdateResourceDTO);
    console.log(this.ResourceService);
  }

  static getInstance(): ResourceRoutes {
    return container.get(ResourceRoutes);
  }

  /**
   * Registers a new resource in the database
   *
   * @param payload
   * Should container Resource data that include Resource data
   */
  @POST
  @Path('create')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async createOrganisation(payload: CreateResourceRO): Promise<CreateResourceDTO> {
    const result = await this.ResourceService.createResource(payload);

    if (result.isFailure) {
      return new CreateResourceDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreateResourceDTO().serialize({ body: { createdOrgId: result.getValue(), statusCode: 201 } });
  }
}
