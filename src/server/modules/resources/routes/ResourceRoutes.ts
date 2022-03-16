import { container, provideSingleton } from '@/di/index';

import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Resource } from '@/modules/resources/models/Resource';
import { Path, PathParam, POST, PUT, Security, GET } from 'typescript-rest';
import { ResourceRO } from './RequestObject';
import { IResourceService } from '@/modules/resources/interfaces';
import { KEYCLOAK_TOKEN } from '@/authenticators/constants';
import { LoggerStorage } from '@/decorators/loggerStorage';
import {
  ResourceDTO,
  CreateResourceDTO,
  UpdateResourceDTO,
  CreatedResourceBodyDTO,
  UpdatedResourceBodyDTO,
  GetResourceBodyDTO,
} from '@/modules/resources/dtos/ResourceDTO';
import { Response } from 'typescript-rest-swagger';
import { BaseErrorDTO } from '@/modules/base/dtos/BaseDTO';

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
  @Response<CreatedResourceBodyDTO>(201, 'Resource created Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  @LoggerStorage()
  public async createResource(payload: ResourceRO): Promise<CreateResourceDTO> {
    const result = await this.resourceService.createResource(payload);

    if (result.isFailure) {
      return new CreateResourceDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreateResourceDTO({ body: { id: result.getValue(), statusCode: 201 } });
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
  @Response<UpdatedResourceBodyDTO>(204, 'Resource updated Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async updateResource(payload: ResourceRO, @PathParam('id') id: number): Promise<UpdateResourceDTO> {
    const result = await this.resourceService.updateResource(payload, id);

    if (result.isFailure) {
      return new UpdateResourceDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new UpdateResourceDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  /**
   * retrieve all resources of a given organization by id
   *
   * @param organizationId organization id
   */
  @GET
  @Path('getOgranizationResourcesById/:organizationId')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  @Response<GetResourceBodyDTO>(200, 'Resource Retrived Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async getOgranizationResources(@PathParam('organizationId') organizationId: number): Promise<ResourceDTO> {
    const result = await this.resourceService.getResourcesOfAGivenOrganizationById(organizationId);
    if (result.isFailure) {
      return new ResourceDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new ResourceDTO({ body: { resources: result.getValue(), statusCode: 200 } });
  }
}
