import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import { IResourceManagerService } from '@/modules/resources/interfaces/IResourceManagerService';
import { ResourceManager } from '@/modules/resources/models/ResourceManager';
import { ResourceManagerDao } from '@/modules/resources/daos/ResourceManagerDao';

@provideSingleton(IResourceManagerService)
export class ResourceManagerService extends BaseService<ResourceManager> implements IResourceManagerService {
  constructor(public dao: ResourceManagerDao) {
    super(dao);
  }

  static getInstance(): IResourceManagerService {
    return container.get(IResourceManagerService);
  }
}
