import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { Calendar } from '@/modules/reservation/models/Calendar';
import { CalendarDao } from '@/modules/reservation/daos/CalendarDAO';
import { ICalendarService } from '@/modules/reservation/interfaces/ICalendarService';

@provideSingleton(ICalendarService)
export class CalendarService extends BaseService<Calendar> {
  constructor(public dao: CalendarDao) {
    super(dao);
  }

  static getInstance(): ICalendarService {
    return container.get(ICalendarService);
  }
}
