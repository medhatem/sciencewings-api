import { container, provideSingleton } from '@di/index';

import { BaseService } from '../../base/services/BaseService';
import { IOrganizationLabelService } from '../interfaces/IOrganizationLabelService';
import { Organization } from '../../organizations/models/Organization';
import { OrganizationLabel } from '../../organizations/models/OrganizationLabel';
import { OrganizationLabelDao } from '../../organizations/daos/OrganizationLabelDao';
import { Result } from '@utils/Result';
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
    const labels = payload.map((el: string) => {
      return { name: el, organization };
    });

    this.dao.repository.persist(labels);
    return Result.ok<number>(200);
  }
}
