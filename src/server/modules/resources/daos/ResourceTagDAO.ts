import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { ResourceTag } from '@/modules/resources/models/ResourceTag';

@provideSingleton()
export class ResourceTagDao extends BaseDao<ResourceTag> {
  private constructor(public model: ResourceTag) {
    super(model);
  }

  static getInstance(): ResourceTagDao {
    return container.get(ResourceTagDao);
  }
}
