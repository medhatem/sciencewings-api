import { LoggerStorage } from '@/decorators/loggerStorage';
import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { GET, Path, PathParam, POST, QueryParam, Security } from 'typescript-rest';
import { IReservationService } from '@/modules/reservation/interfaces/IReservationService';
import { Reservation } from '../models/Reservation';
import { Response } from 'typescript-rest-swagger';
import { ReservationCreateDTO, ReservationGetDTO, ReservationsDTO } from '@/modules/reservation/dtos/ReservationDTO';
import { InternalServerError } from '@/Exceptions/InternalServerError';
import { NotFoundError } from '@/Exceptions/NotFoundError';
import { ReservationRO } from './RequestObject';

@provideSingleton()
@Path('reservation')
export class ReservationRoutes extends BaseRoutes<Reservation> {
  constructor(private reservationService: IReservationService) {
    super(reservationService as any, new ReservationGetDTO(), new ReservationGetDTO());
  }

  static getInstance(): ReservationRoutes {
    return container.get(ReservationRoutes);
  }

  /**
   * get all reservations within a given date range
   *
   * @param resourceId
   * Requested resource id
   */
  @GET
  @Path('getEventsByRange/:resourceId')
  @Security(['{orgId}-view-all-resource-reservations'])
  @LoggerStorage()
  @Response<ReservationsDTO>(200, 'reservations fetched successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getEventsByRange(
    @PathParam('resourceId') resourceId: number,
    @QueryParam('start') start: string,
    @QueryParam('end') end: string,
  ): Promise<ReservationsDTO> {
    const result = await this.reservationService.getEventsByRange(resourceId, new Date(start), new Date(end));
    return new ReservationsDTO({ body: { data: [...(result || [])] }, statusCode: 201 });
  }

  /**
   * Create a reservation by resource Id
   *
   * @param resourceId
   * Requested resource id
   */
  @POST
  @Path('/:resourceId')
  @Security(['{orgId}-create-resource-reservation'])
  @LoggerStorage()
  @Response<ReservationCreateDTO>(201, 'Reservation created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async createReservation(
    @PathParam('resourceId') resourceId: number,
    payload: ReservationRO,
  ): Promise<ReservationCreateDTO> {
    const result = await this.reservationService.createReservation(resourceId, payload);

    return new ReservationCreateDTO({ body: result, statusCode: 201 });
  }
}
