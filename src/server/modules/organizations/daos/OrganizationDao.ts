import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Organization } from '@/modules/organizations/models/Organization';

@provideSingleton()
export class OrganizationDao extends BaseDao<Organization> {
  private constructor(public model: Organization) {
    super(model);
  }

  static getInstance(): OrganizationDao {
    return container.get(OrganizationDao);
  }
}
