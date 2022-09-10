import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { ResourceRate } from '@/modules/resources/models/ResourceRate';

@provideSingleton()
export class ResourceRateDAO extends BaseDao<ResourceRate> {
  private constructor(public model: ResourceRate) {
    super(model);
  }

  static getInstance(): ResourceRateDAO {
    return container.get(ResourceRateDAO);
  }
}
