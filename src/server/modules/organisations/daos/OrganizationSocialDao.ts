import { OrganizationSocial } from './../models/OraganizationSocial';
import { container, provideSingleton } from '@di/index';

import { BaseDao } from '../../base/daos/BaseDao';

@provideSingleton()
export class OrganisationSocialDao extends BaseDao<OrganizationSocial> {
  private constructor(public model: OrganizationSocial) {
    super(model);
  }

  static getInstance(): OrganisationSocialDao {
    return container.get(OrganisationSocialDao);
  }
}
