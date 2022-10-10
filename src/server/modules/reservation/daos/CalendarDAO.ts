import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Calendar } from '@/modules/reservation/models/Calendar';

@provideSingleton()
export class CalendarDao extends BaseDao<Calendar> {
  private constructor(public model: Calendar) {
    super(model);
  }

  static getInstance(): CalendarDao {
    return container.get(CalendarDao);
  }
}
