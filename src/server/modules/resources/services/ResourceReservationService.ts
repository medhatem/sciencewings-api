import * as moment from 'moment-timezone';

import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { IResourceReservationService } from '@/modules/resources/interfaces/IResourceReservationService';
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';
import { NotFoundError } from '@/Exceptions/NotFoundError';
import { ResourceEvent } from '@/modules/resources/models/ResourceEvent';
import { ResourceEventDao } from '@/modules/resources/daos/ResourceEventDAO';
import { log } from '@/decorators/log';

@provideSingleton(IResourceReservationService)
export class ResourceReservationService extends BaseService<ResourceEvent> implements IResourceReservationService {
  constructor(public dao: ResourceEventDao, private resourceService: IResourceService) {
    super(dao);
  }

  static getInstance(): IResourceReservationService {
    return container.get(IResourceReservationService);
  }

  /**
   *
   */
  @log()
  async getEventsByRange(resourceId: number, start: Date, end: Date): Promise<any> {
    const resource = await this.resourceService.get(resourceId);

    if (!resource) {
      throw new NotFoundError('');
    }
    // get the calendars of the reource
    await resource.calendar.init();
    const calendar = resource.calendar[0];
    const reservations = await this.getByCriteria<FETCH_STRATEGY.ALL>(
      {
        resourceCalendar: calendar.id,
        dateFrom: { $lte: start },
        dateTo: { $gte: end },
      },
      FETCH_STRATEGY.ALL,
    );

    return reservations;
  }

  @log()
  async createReservation(resourceId: number, payload: any): Promise<any> {
    const resource = await this.resourceService.get(resourceId);
    if (!resource) {
      throw new NotFoundError('');
    }
    await resource.calendar.init();
    const calendar = resource.calendar[0]; // by default we only use one calendar for now
    const event = this.wrapEntity(ResourceEvent.getInstance(), {
      title: payload.title,
      dateFrom: moment(payload.dateFrom).utc().toDate(),
      dateTo: moment(payload.dateTo).utc().toDate(),
    });
    event.resourceCalendar = calendar;

    await this.create(event);
    return event;
  }
}
