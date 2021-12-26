import { container, provideSingleton } from '@di/index';
import { ResourceService } from '../services/ResourceService';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { Resource } from '../models/Resource';
import {
  Path,
  //  POST,
  GET,
  QueryParam,
} from 'typescript-rest';
// import { Response } from 'typescript-rest-swagger';

@provideSingleton()
@Path('organisation')
export class ResourceRoutes extends BaseRoutes<Resource> {
  constructor(private ResourceService: ResourceService) {
    super(ResourceService);
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
