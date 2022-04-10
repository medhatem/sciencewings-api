import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@/utils/Result';

export abstract class IResourceService extends IBaseService<any> {
  getResourceReservationGeneral: (resourceId: number) => Promise<Result<any>>;
  getResourceReservationUnites: (resourceId: number) => Promise<Result<any>>;
  getResourceReservationTimerRestriction: (resourceId: number) => Promise<Result<any>>;
  getResourceReservationVisibility: (resourceId: number) => Promise<Result<any>>;
}
