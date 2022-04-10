import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { ResourceSettings } from '@/modules/resources/models/ResourceSettings';

@provideSingleton()
export class ResourceSettingsDao extends BaseDao<ResourceSettings> {
  private constructor(public model: ResourceSettings) {
    super(model);
  }

  static getInstance(): ResourceSettingsDao {
    return container.get(ResourceSettingsDao);
  }
}
