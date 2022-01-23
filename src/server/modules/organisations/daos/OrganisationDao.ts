import { container, provideSingleton } from '@di/index';

import { BaseDao } from '../../base/daos/BaseDao';
import { Organization } from '@modules/organisations/models/Organization';

@provideSingleton()
export class OrganisationDao extends BaseDao<Organization> {
  private constructor(public model: Organization) {
    super(model);
  }

  static getInstance(): OrganisationDao {
    return container.get(OrganisationDao);
  }
}
