import { container, inject, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Calendar } from '@/modules/reservation/models/Calendar';
import { LazyServiceIdentifer } from 'inversify/lib/annotation/lazy_service_identifier';

@provideSingleton()
export class CalendarDao extends BaseDao<Calendar> {
  private constructor(
    //public model: Calendar
    @inject(new LazyServiceIdentifer(() => Calendar)) public model: Calendar,
  ) {
    super(model);
  }

  static getInstance(): CalendarDao {
    return container.get(CalendarDao);
  }
}
