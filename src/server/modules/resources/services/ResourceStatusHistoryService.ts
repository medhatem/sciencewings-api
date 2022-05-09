import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { ResourceStatusHistory } from '@/modules/resources/models/ResourceStatusHistory';
import { IResourceStatusHistoryService } from '@/modules/resources/interfaces/IResourceStatusHistoryService';
import { ResourceStatusHistoryDao } from '@/modules/resources/daos/ResourceStatusHistoryDAO';

@provideSingleton(IResourceStatusHistoryService)
export class ResourceStatusHistoryService extends BaseService<ResourceStatusHistory> {
  constructor(public dao: ResourceStatusHistoryDao) {
    super(dao);
  }

  static getInstance(): IResourceStatusHistoryService {
    return container.get(IResourceStatusHistoryService);
  }
}
