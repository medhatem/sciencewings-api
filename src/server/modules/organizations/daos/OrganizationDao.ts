import { container, provideSingleton } from '@/di/index';
import { BaseDao } from '../../base/daos/BaseDao';
import { Organization } from '../../organizations/models/Organization';

@provideSingleton()
export class OrganizationDao extends BaseDao<Organization> {
  private constructor(public model: Organization) {
    super(model);
  }

  static getInstance(): OrganizationDao {
    return container.get(OrganizationDao);
  }
}
