import { container, provideSingleton } from '@di/index';

import { BaseDao } from '../../base/daos/BaseDao';
import { Organisation } from '@modules/organisations/models/Organisation';

@provideSingleton()
export class OrganisationDao extends BaseDao<Organisation> {
  private constructor(public model: Organisation) {
    super(model);
  }

  static getInstance(): OrganisationDao {
    return container.get(OrganisationDao);
  }
}
