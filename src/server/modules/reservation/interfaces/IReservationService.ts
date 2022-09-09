import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { ReservationRO } from '@/modules/reservation/routes/RequestObject';

export abstract class IReservationService extends IBaseService<any> {
  getEventsByRange: (resourceId: number, start: Date, end: Date) => Promise<any>;
  createReservation: (resourceId: number, payload: ReservationRO) => Promise<any>;
}
