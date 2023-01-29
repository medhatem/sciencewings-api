import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { IResourceEventService } from '@/modules/resources/interfaces/IResourceEventService';
import { Reservation } from '@/modules/reservation/models/Reservation';
import { ResourceEventDao } from '@/modules/resources/daos/ResourceEventDAO';

@provideSingleton(IResourceEventService)
export class ResourceEventService extends BaseService<Reservation> {
  constructor(public dao: ResourceEventDao) {
    super(dao);
  }

  static getInstance(): IResourceEventService {
    return container.get(IResourceEventService);
  }
}
