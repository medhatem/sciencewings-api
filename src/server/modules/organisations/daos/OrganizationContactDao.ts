import { OrganizationContact } from './../models/OrganizationContact';
import { container, provideSingleton } from '@di/index';

import { BaseDao } from '../../base/daos/BaseDao';

@provideSingleton()
export class OrganisationContactDao extends BaseDao<OrganizationContact> {
  private constructor(public model: OrganizationContact) {
    super(model);
  }

  static getInstance(): OrganisationContactDao {
    return container.get(OrganisationContactDao);
  }
}
