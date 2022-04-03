import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@/utils/Result';

export abstract class IResourceService extends IBaseService<any> {
  getResourceSettingsReservationGeneral: (resourceId: number) => Promise<Result<any>>;
  getResourceUnites: (resourceId: number) => Promise<Result<any>>;
  getResourceTimerRestriction: (resourceId: number) => Promise<Result<any>>;
}
