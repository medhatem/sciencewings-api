import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { ResourceStatusHistory } from '@/modules/resources/models/ResourceStatusHistory';

@provideSingleton()
export class ResourceStatusHistoryDao extends BaseDao<ResourceStatusHistory> {
  private constructor(public model: ResourceStatusHistory) {
    super(model);
  }

  static getInstance(): ResourceStatusHistoryDao {
    return container.get(ResourceStatusHistoryDao);
  }
}
