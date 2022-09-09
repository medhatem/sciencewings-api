import { LoggerStorage } from '@/decorators/loggerStorage';
import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { GET, Path, PathParam, POST, QueryParam, Security } from 'typescript-rest';
import { IReservationService } from '@/modules/reservation/interfaces/IReservationService';
import { Reservation } from '../models/Reservation';
import { Response } from 'typescript-rest-swagger';
import { ReservationCreateDTO, ReservationGetDTO } from '../dtos/ReservationDTO';
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
   * Get a resource settings in the database
   *
   * @param resourceId
   * Requested resource id
   */
  @GET
  @Path('getEventsByRange/:resourceId')
  @Security()
  @LoggerStorage()
  public async getEventsByRange(
    @PathParam('resourceId') resourceId: number,
    @QueryParam('start') start: string,
    @QueryParam('end') end: string,
  ): Promise<any> {
    const result = await this.reservationService.getEventsByRange(resourceId, new Date(start), new Date(end));

    return { result };
  }

  /**
   * Get a resource settings in the database
   *
   * @param resourceId
   * Requested resource id
   */
  @POST
  @Path('/:resourceId')
  @Security()
  @LoggerStorage()
  @Response<ReservationCreateDTO>(201, 'Organization created Successfully')
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
