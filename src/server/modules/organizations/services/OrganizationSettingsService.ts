import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { OrganizationSettingsDao } from '../daos/OrganizationSettingsDao';
import { IOrganizationSettingsService } from '../interfaces/IOrganizationSettingsService';
import { OrganizationSettings } from '../models/OrganizationSettings';

@provideSingleton(IOrganizationSettingsService)
export class OrganizationSettingsService extends BaseService<OrganizationSettings> {
  constructor(public dao: OrganizationSettingsDao) {
    super(dao);
  }

  static getInstance(): IOrganizationSettingsService {
    return container.get(IOrganizationSettingsService);
  }
}
