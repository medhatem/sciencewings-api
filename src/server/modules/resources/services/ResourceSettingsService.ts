import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { ResourceSettings } from '@/modules/resources/models/ResourceSettings';
import { IResourceSettingsService } from '@/modules/resources/interfaces/IResourceSettingsService';
import { ResourceSettingsDao } from '@/modules/resources/daos/ResourceSettingsDAO';

@provideSingleton(IResourceSettingsService)
export class ResourceSettingsService extends BaseService<ResourceSettings> {
  constructor(public dao: ResourceSettingsDao) {
    super(dao);
  }

  static getInstance(): IResourceSettingsService {
    return container.get(IResourceSettingsService);
  }
}
