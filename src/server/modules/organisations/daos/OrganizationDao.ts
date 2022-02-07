import { container, provideSingleton } from '@di/index';
import { Organization } from '@modules/organizations/models/Organization';
import { BaseDao } from '../../base/daos/BaseDao';

@provideSingleton()
export class OrganisationDao extends BaseDao<Organization> {
  private constructor(public model: Organization) {
    super(model);
  }

  static getInstance(): OrganisationDao {
    return container.get(OrganisationDao);
  }
}
