import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { OrganizationSettings } from '../models/OrganizationSettings';

@provideSingleton()
export class OrganizationSettingsDao extends BaseDao<OrganizationSettings> {
  private constructor(public model: OrganizationSettings = OrganizationSettings.getInstance()) {
    super(model);
  }

  static getInstance(): OrganizationSettingsDao {
    return container.get(OrganizationSettingsDao);
  }
}
