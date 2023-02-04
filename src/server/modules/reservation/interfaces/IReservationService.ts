import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { ReservationRO } from '@/modules/reservation/routes/RequestObject';
import { ReservationsList } from '@/types/types';

export abstract class IReservationService extends IBaseService<any> {
  getEventsByRange: (
    resourceId: number,
    start: Date,
    end: Date,
    page?: number,
    size?: number,
  ) => Promise<ReservationsList>;
  createReservation: (resourceId: number, payload: ReservationRO) => Promise<any>;
}
