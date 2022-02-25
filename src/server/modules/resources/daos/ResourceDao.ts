import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '../../base/daos/BaseDao';
import { Resource } from '../../resources/models/Resource';

@provideSingleton()
export class ResourceDao extends BaseDao<Resource> {
  private constructor(public model: Resource) {
    super(model);
  }

  static getInstance(): ResourceDao {
    return container.get(ResourceDao);
  }
}
