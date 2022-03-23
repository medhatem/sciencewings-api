import { container, provideSingleton } from '@/di/index';

import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Resource } from '@/modules/resources/models/Resource';
import { Path } from 'typescript-rest';
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';
import { ResourceDTO, UpdateResourceDTO } from '@/modules/resources/dtos/ResourceDTO';

@provideSingleton()
@Path('resources')
export class ResourceRoutes extends BaseRoutes<Resource> {
  constructor(resourceService: IResourceService) {
    super(resourceService as any, new ResourceDTO(), new UpdateResourceDTO());
  }

  static getInstance(): ResourceRoutes {
    return container.get(ResourceRoutes);
  }
}
