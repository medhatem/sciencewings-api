import { container, provideSingleton } from '@di/index';

import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Resource } from '../models/Resource';
import { Path, PathParam, POST, PUT, Security } from 'typescript-rest';
import { CreateResourceRO } from './RequestObject';
import { IResourceService } from '../interfaces';
import { KEYCLOAK_TOKEN } from '../../../authenticators/constants';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { ResourceDTO } from '@/modules/resources/dtos/ResourceDTO';
import { UpdateResourceDTO } from '@/modules/resources/dtos/UpdateResourceDTO';
import { CreateResourceDTO } from '@/modules/resources/dtos/CreatedResourceDTO';

@provideSingleton()
@Path('resources')
export class ResourceRoutes extends BaseRoutes<Resource> {
  constructor(private ResourceService: IResourceService) {
    super(ResourceService as any, new ResourceDTO(), new UpdateResourceDTO());
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
  public async createResource(payload: CreateResourceRO): Promise<CreateResourceDTO> {
    const result = await this.ResourceService.createResource(payload);

    if (result.isFailure) {
      return new CreateResourceDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreateResourceDTO().serialize({ body: { resourceId: result.getValue(), statusCode: 201 } });
  }

  @PUT
  @Path('update/:id')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async updateResource(payload: CreateResourceRO, @PathParam('id') id: number): Promise<CreateResourceDTO> {
    const result = await this.ResourceService.updateResource(payload, id);

    if (result.isFailure) {
      return new CreateResourceDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreateResourceDTO().serialize({ body: { resourceId: result.getValue(), statusCode: 201 } });
  }
}
