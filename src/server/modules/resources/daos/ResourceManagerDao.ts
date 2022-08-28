import { container, provideSingleton } from '@/di/index';
import { ResourceManager } from '@/modules/resources/models/ResourceManager';

import { BaseDao } from '@/modules/base/daos/BaseDao';

@provideSingleton()
export class ResourceManagerDao extends BaseDao<ResourceManager> {
  private constructor(public model: ResourceManager) {
    super(model);
  }

  static getInstance(): ResourceManagerDao {
    return container.get(ResourceManagerDao);
  }
}
