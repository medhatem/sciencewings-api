import { OrganizationLabel } from '@modules/organisations/models/OrganizationLabel';
import { container, provideSingleton } from '@di/index';

import { BaseDao } from '../../base/daos/BaseDao';

@provideSingleton()
export class OrganisationLabelDao extends BaseDao<OrganizationLabel> {
  private constructor(public model: OrganizationLabel) {
    super(model);
  }

  static getInstance(): OrganisationLabelDao {
    return container.get(OrganisationLabelDao);
  }
}
