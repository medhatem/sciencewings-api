import { container, provideSingleton } from '@di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { ResourceCalendar } from './../models/ResourceCalendar';

@provideSingleton()
export class ResourceCalendarDao extends BaseDao<ResourceCalendar> {
  private constructor(public model: ResourceCalendar) {
    super(model);
  }

  static getInstance(): ResourceCalendarDao {
    return container.get(ResourceCalendarDao);
  }
}
