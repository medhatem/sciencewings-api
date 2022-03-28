import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { ResourceEvent } from '@/modules/resources/models/ResourceEvent';

@provideSingleton()
export class ResourceEventDao extends BaseDao<ResourceEvent> {
  private constructor(public model: ResourceEvent) {
    super(model);
  }

  static getInstance(): ResourceEventDao {
    return container.get(ResourceEventDao);
  }
}
