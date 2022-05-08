import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { ResourceCalendar } from '@/modules/resources/models/ResourceCalendar';
import { ResourceCalendarDao } from '@/modules/resources/daos/ResourceCalendarDAO';
import { IResourceCalendarService } from '@/modules/resources/interfaces/IResourceCalendarService';

@provideSingleton(IResourceCalendarService)
export class ResourceCalendarService extends BaseService<ResourceCalendar> {
  constructor(public dao: ResourceCalendarDao) {
    super(dao);
  }

  static getInstance(): IResourceCalendarService {
    return container.get(IResourceCalendarService);
  }
}
