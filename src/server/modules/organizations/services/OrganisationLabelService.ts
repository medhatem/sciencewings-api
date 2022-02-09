import { container, provideSingleton } from '@di/index';
import { BaseService } from '@modules/base/services/BaseService';
import { Result } from '@utils/Result';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';
import { OrganizationLabel } from '@modules/organizations/models/OrganizationLabel';
import { Organization } from '@modules/organizations/models/Organization';
import { OrganisationLabelDao } from '@modules/organizations/daos/OrganisationLabelDao';

@provideSingleton()
export class OrganisationLabelService extends BaseService<OrganizationLabel> {
  constructor(public dao: OrganisationLabelDao) {
    super(dao);
  }

  static getInstance(): OrganisationLabelService {
    return container.get(OrganisationLabelService);
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
