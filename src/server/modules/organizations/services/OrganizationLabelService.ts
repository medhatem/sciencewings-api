import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { IOrganizationLabelService } from '@/modules/organizations/interfaces/IOrganizationLabelService';
import { Organization } from '@/modules/organizations/models/Organization';
import { OrganizationLabel } from '@/modules/organizations/models/OrganizationLabel';
import { OrganizationLabelDao } from '@/modules/organizations/daos/OrganizationLabelDao';
import { Result } from '@/utils/Result';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';

@provideSingleton(IOrganizationLabelService)
export class OrganisationLabelService extends BaseService<OrganizationLabel> implements IOrganizationLabelService {
  constructor(public dao: OrganizationLabelDao) {
    super(dao);
  }

  static getInstance(): IOrganizationLabelService {
    return container.get(IOrganizationLabelService);
  }

  @log()
  @safeGuard()
  async createLabel(payload: OrganizationLabel): Promise<Result<number>> {
    const phone = await this.dao.create(payload);
    return Result.ok<number>(phone.id);
  }

  @log()
  @safeGuard()
  async createBulkLabel(payload: string[], organization: Organization): Promise<Result<number>> {
    const labels = payload.map((name: string) => {
      const label = this.wrapEntity(new OrganizationLabel(), { name });
      label.organization = organization;
      return label;
    });

    this.dao.repository.persistAndFlush(labels);
    return Result.ok<number>(200);
  }
}
