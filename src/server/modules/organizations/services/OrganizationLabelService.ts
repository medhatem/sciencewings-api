import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { IOrganizationLabelService } from '@/modules/organizations/interfaces/IOrganizationLabelService';
import { Organization } from '@/modules/organizations/models/Organization';
import { OrganizationLabel } from '@/modules/organizations/models/OrganizationLabel';
import { OrganizationLabelDao } from '@/modules/organizations/daos/OrganizationLabelDao';
import { log } from '@/decorators/log';

@provideSingleton(IOrganizationLabelService)
export class OrganizationLabelService extends BaseService<OrganizationLabel> implements IOrganizationLabelService {
  constructor(public dao: OrganizationLabelDao) {
    super(dao);
  }

  static getInstance(): IOrganizationLabelService {
    return container.get(IOrganizationLabelService);
  }

  @log()
  async createLabel(payload: OrganizationLabel): Promise<OrganizationLabel> {
    return await this.dao.create(payload);
  }

  @log()
  async createBulkLabel(payload: string[], organization: Organization): Promise<void> {
    const labels = payload.map((name: string) => {
      const label = this.wrapEntity(new OrganizationLabel(), { name });
      label.organization = organization;
      return label;
    });

    this.dao.repository.persistAndFlush(labels);
  }
}
