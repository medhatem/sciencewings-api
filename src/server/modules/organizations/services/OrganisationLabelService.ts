import { OrganisationLabelDao } from '../daos/OrganisationLabelDao';
import { container, provideSingleton } from '@di/index';
import { BaseService } from '@modules/base/services/BaseService';
import { Result } from '@utils/Result';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';
import { OrganizationLabel } from '@modules/organizations/models/OrganizationLabel';

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
}
