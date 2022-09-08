import { IBaseService } from '@/modules/base/interfaces/IBaseService';

export abstract class IResourceReservationService extends IBaseService<any> {
  getEventsByRange: (resourceId: number, start: Date, end: Date) => Promise<any>;
  createReservation: (resourceId: number, payload: any) => Promise<any>;
}
