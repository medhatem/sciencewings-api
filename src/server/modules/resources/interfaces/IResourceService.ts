import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@/utils/Result';
import {
  ResourcesSettingsReservationGeneralRO,
  ResourcesSettingsReservationUnitRO,
  ResourceRateRO,
  ResourceTimerRestrictionRO,
  ResourceReservationVisibilityRO,
  ResourceSettingsGeneralPropertiesRO,
  ResourceSettingsGeneralStatusRO,
  ResourceSettingsGeneralVisibilityRO,
} from '@/modules/resources/routes/RequestObject';
import { ResourceRO } from '@/modules/resources/routes/RequestObject';
import { Resource } from '@/modules/resources/models/Resource';

export abstract class IResourceService extends IBaseService<any> {
  getResourcesOfAGivenOrganizationById: (organizationId: number) => Promise<Result<Resource[]>>;
  createResource: (payload: ResourceRO) => Promise<Result<number>>;
  updateResource: (payload: ResourceRO, resourceId: number) => Promise<Result<number>>;

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
    resourceRateId: number,
  ) => Promise<Result<number>>;

  updateResourcesSettingsGeneralStatus: (
    payload: ResourceSettingsGeneralStatusRO,
    resourceId: number,
  ) => Promise<Result<number>>;
  updateResourcesSettingsGeneralVisibility: (
    payload: ResourceSettingsGeneralVisibilityRO,
    resourceId: number,
  ) => Promise<Result<number>>;
  updateResourcesSettingsnGeneralProperties: (
    payload: ResourceSettingsGeneralPropertiesRO,
    resourceId: number,
  ) => Promise<Result<number>>;

  getResourceSettings: (resourceId: number) => Promise<Result<any>>;
}
