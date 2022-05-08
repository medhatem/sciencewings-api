import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { ResourceEvent } from '@/modules/resources/models/ResourceEvent';
import { IResourceEventService } from '@/modules/resources/interfaces/IResourceEventService';
import { ResourceEventDao } from '@/modules/resources/daos/ResourceEventDAO';

@provideSingleton(IResourceEventService)
export class ResourceEventService extends BaseService<ResourceEvent> {
  constructor(public dao: ResourceEventDao) {
    super(dao);
  }

  static getInstance(): IResourceEventService {
    return container.get(IResourceEventService);
  }
}
