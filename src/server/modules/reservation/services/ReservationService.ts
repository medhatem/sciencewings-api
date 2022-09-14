import * as moment from 'moment-timezone';

import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { IReservationService } from '@/modules/reservation/interfaces/IReservationService';
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { NotFoundError } from '@/Exceptions/NotFoundError';
import { Reservation } from '@/modules/reservation/models/Reservation';
import { ReservationRO } from '@/modules/reservation/routes/RequestObject';
import { ResourceEventDao } from '@/modules/resources/daos/ResourceEventDAO';
import { log } from '@/decorators/log';
import { validate } from '@/decorators/validate';
import { validateParam } from '@/decorators/validateParam';
import { CreateReservationSchema } from '../schemas/ReservationCreationSchema';

@provideSingleton(IReservationService)
export class ReservationService extends BaseService<Reservation> implements IReservationService {
  constructor(
    public dao: ResourceEventDao,
    private resourceService: IResourceService,
    private userService: IUserService,
  ) {
    super(dao);
  }

  static getInstance(): IReservationService {
    return container.get(IReservationService);
  }

  /**
   *
   */
  @log()
  async getEventsByRange(resourceId: number, start: Date, end: Date): Promise<any> {
    const resource = await this.resourceService.get(resourceId);
    if (!resource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', { variables: { resource: `${resourceId}` } });
    }
    // get the calendars of the reource
    await resource.calendar.init();
    const calendar = resource.calendar[0];
    const reservations = await this.getByCriteria<FETCH_STRATEGY.ALL>(
      {
        resourceCalendar: calendar.id,
        dateFrom: { $lte: end },
        dateTo: { $gte: start },
      },
      FETCH_STRATEGY.ALL,
    );

    return reservations;
  }

  @log()
  @validate
  async createReservation(
    resourceId: number,
    @validateParam(CreateReservationSchema) payload: ReservationRO,
  ): Promise<Reservation> {
    const resource = await this.resourceService.get(resourceId);
    if (!resource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', { variables: { resource: `${resourceId}` } });
    }
    const user = await this.userService.get(payload.userId);
    if (!user) {
      throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', { variables: { user: `${payload.userId}` } });
    }
    await resource.calendar.init();
    const calendar = resource.calendar[0]; // by default we only use one calendar for now
    const event = this.wrapEntity(Reservation.getInstance(), {
      title: payload.title,
      dateFrom: moment(payload.start).tz('utc').toDate(),
      dateTo: moment(payload.end).tz('utc').toDate(),
    });

    event.resourceCalendar = calendar;
    event.user = user;
    await this.create(event);
    return event;
  }
}
