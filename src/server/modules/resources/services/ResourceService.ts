import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import { Resource } from '@/modules/resources/models/Resource';
import { ResourceDao } from '@/modules/resources/daos/ResourceDao';
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';

@provideSingleton(IResourceService)
export class ResourceService extends BaseService<Resource> {
  constructor(public dao: ResourceDao) {
    super(dao);
  }

  static getInstance(): IResourceService {
    return container.get(IResourceService);
  }
}
