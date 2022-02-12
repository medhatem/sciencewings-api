import { OrganizationLabel } from '../../organizations/models/OrganizationLabel';
import { container, provideSingleton } from '@di/index';
import { BaseDao } from '../../base/daos/BaseDao';

@provideSingleton()
export class OrganizationLabelDao extends BaseDao<OrganizationLabel> {
  private constructor(public model: OrganizationLabel) {
    super(model);
  }

  static getInstance(): OrganizationLabelDao {
    return container.get(OrganizationLabelDao);
  }
}
