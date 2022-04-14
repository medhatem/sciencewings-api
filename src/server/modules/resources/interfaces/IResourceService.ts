import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@/utils/Result';
import {
  ResourcesSettingsReservationGeneralRO,
  ResourcesSettingsReservationUnitRO,
  ResourceRateRO,
  ResourceTimerRestrictionRO,
  ResourceReservationVisibilityRO,
} from '@/modules/resources/routes/RequestObject';

export abstract class IResourceService extends IBaseService<any> {
  getResourceReservationGeneral: (resourceId: number) => Promise<Result<any>>;
  getResourceReservationUnites: (resourceId: number) => Promise<Result<any>>;
  getResourceReservationTimerRestriction: (resourceId: number) => Promise<Result<any>>;
  getResourceReservationVisibility: (resourceId: number) => Promise<Result<any>>;

  updateResourceReservationGeneral: (
    payload: ResourcesSettingsReservationGeneralRO,
    resourceId: number,
  ) => Promise<Result<number>>;

  updateResourceReservationUnits: (
    payload: ResourcesSettingsReservationUnitRO,
    resourceId: number,
  ) => Promise<Result<number>>;

  createResourceRate: (payload: ResourceRateRO, resourceId: number) => Promise<Result<number>>;

  updateResourceRate: (payload: ResourceRateRO, resourceRateId: number) => Promise<Result<number>>;

  updateResourceReservationTimerRestriction: (
    payload: ResourceTimerRestrictionRO,
    resourceRateId: number,
  ) => Promise<Result<number>>;

  updateResourceReservationVisibility: (
    payload: ResourceReservationVisibilityRO,
    resourceId: number,
  ) => Promise<Result<number>>;

  getResourceSettings: (resourceId: number) => Promise<Result<any>>;
}
