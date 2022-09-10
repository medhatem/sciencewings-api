import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { ResourceStatus } from '@/modules/resources/models/ResourceStatus';

@provideSingleton()
export class ResourceStatusDao extends BaseDao<ResourceStatus> {
  private constructor(public model: ResourceStatus) {
    super(model);
  }

  static getInstance(): ResourceStatusDao {
    return container.get(ResourceStatusDao);
  }
}
