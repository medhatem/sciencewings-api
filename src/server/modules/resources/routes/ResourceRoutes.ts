import { container, provideSingleton } from '@/di/index';

import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Resource } from '@/modules/resources/models/Resource';
import { Path, PathParam, POST, PUT, Security, GET } from 'typescript-rest';
import { CreateResourceRO } from './RequestObject';
import { IResourceService } from '@/modules/resources/interfaces';
import { KEYCLOAK_TOKEN } from '../../../authenticators/constants';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { ResourceDTO, CreateResourceDTO, UpdateResourceDTO } from '@/modules/resources/dtos/ResourceDTO';
import { Response } from 'typescript-rest-swagger';

@provideSingleton()
@Path('resources')
export class ResourceRoutes extends BaseRoutes<Resource> {
  constructor(private resourceService: IResourceService) {
    super(resourceService as any, new ResourceDTO(), new UpdateResourceDTO());
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
  @Response<CreateResourceDTO>(201, 'Resource created Successfully')
  @Response<CreateResourceDTO>(500, 'Internal Server Error')
  @LoggerStorage()
  public async createResource(payload: CreateResourceRO): Promise<CreateResourceDTO> {
    const result = await this.resourceService.createResource(payload);

    if (result.isFailure) {
      return new CreateResourceDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreateResourceDTO().serialize({ body: { resourceId: result.getValue(), statusCode: 201 } });
  }

  /**
   * Update a resource in the database
   *
   * @param payload
   * Should container Resource data that include Resource data with its id
   */
  @PUT
  @Path('update/:id')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  @Response<CreateResourceDTO>(204, 'Resource updated Successfully')
  @Response<CreateResourceDTO>(500, 'Internal Server Error')
  public async updateResource(payload: CreateResourceRO, @PathParam('id') id: number): Promise<CreateResourceDTO> {
    const result = await this.resourceService.updateResource(payload, id);

    if (result.isFailure) {
      return new CreateResourceDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreateResourceDTO().serialize({ body: { resourceId: result.getValue(), statusCode: 204 } });
  }

  /**
   * get all resources given and organization id
   *
   * @param id organization id
   */
  @GET
  @Path('getOgranizationResourcesById/:id')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  @Response<CreateResourceDTO>(200, 'Resource Retrived Successfully')
  @Response<CreateResourceDTO>(500, 'Internal Server Error')
  public async getOgranizationResources(@PathParam('id') id: number): Promise<CreateResourceDTO> {
    const result = await this.resourceService.getOgranizationResources(id);

    if (result.isFailure) {
      return new CreateResourceDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreateResourceDTO().serialize({ body: { resources: result.getValue(), statusCode: 200 } });
  }
}
