import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { ResourceStatus } from '@/modules/resources/models/ResourceStatus';
import { IResourceStatusService } from '@/modules/resources/interfaces/IResourceStatusService';
import { ResourceStatusDao } from '@/modules/resources/daos/ResourceStatusDAO';

@provideSingleton(IResourceStatusService)
export class ResourceStatusService extends BaseService<ResourceStatus> {
  constructor(public dao: ResourceStatusDao) {
    super(dao);
  }

  static getInstance(): IResourceStatusService {
    return container.get(IResourceStatusService);
  }
}
