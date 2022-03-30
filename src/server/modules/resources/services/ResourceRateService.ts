import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import { ResourceRateDAO } from '@/modules/resources/daos/ResourceRateDAO';
import { ResourceRate } from '@/modules/resources/models/ResourceRate';
import { IResourceRateService } from '@/modules/resources/interfaces/IResourceRateService';

@provideSingleton(IResourceRateService)
export class ResourceRateService extends BaseService<ResourceRate> {
  constructor(public dao: ResourceRateDAO) {
    super(dao);
  }

  static getInstance(): IResourceRateService {
    return container.get(IResourceRateService);
  }
}
