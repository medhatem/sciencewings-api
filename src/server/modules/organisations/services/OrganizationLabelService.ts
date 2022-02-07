import { OrganisationLabelDao } from '../daos/OrganizationLabelDao';
import { container, provideSingleton } from '@di/index';
import { BaseService } from '@modules/base/services/BaseService';
import { Result } from '@utils/Result';
import { log } from 'server/decorators/log';
import { safeGuard } from 'server/decorators/safeGuard';
import { OrganizationLabel } from '../models/OrganizationLabel';

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
