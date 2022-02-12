import { ResourceCalendar } from './../models/ResourceCalendar';
import { container, provideSingleton } from '@di/index';
import { BaseDao } from '../../base/daos/BaseDao';

@provideSingleton()
export class ResourceCalendarDao extends BaseDao<ResourceCalendar> {
  private constructor(public model: ResourceCalendar) {
    super(model);
  }

  static getInstance(): ResourceCalendarDao {
    return container.get(ResourceCalendarDao);
  }
}
