import { container, provideSingleton } from '@di/index';
import { ResourceService } from '../services/ResourceService';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { Resource } from '../models/Resource';
import { Path, GET, QueryParam } from 'typescript-rest';
import { ResourceDTO } from '../dtos/ResourceDTO';

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

  @GET
  @Path('newRoute')
  public async newRoute(@QueryParam('body') body: string) {
    return body;
  }
}
