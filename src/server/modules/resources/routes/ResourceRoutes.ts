import { POST, Path, Security } from 'typescript-rest';
import { container, provideSingleton } from '@di/index';

import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { CreateResourceDTO } from '@/modules/resources/dtos/CreatedResourceDTO';
import { CreateResourceRO } from './RequestObject';
import { IResourceService } from '../interfaces';
import { KEYCLOAK_TOKEN } from './../../../authenticators/constants';
import { LoggerStorage } from '../../../decorators/loggerStorage';
import { Resource } from '../models/Resource';
import { ResourceDTO } from '@/modules/resources/dtos/ResourceDTO';
import { UpdateResourceDTO } from '@/modules/resources/dtos/UpdateResourceDTO';

@provideSingleton()
@Path('resources')
export class ResourceRoutes extends BaseRoutes<Resource> {
  constructor(private ResourceService: IResourceService) {
    super(ResourceService as any, ResourceDTO, UpdateResourceDTO);
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
