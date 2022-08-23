import {
  ResourceRateRO,
  ResourceReservationVisibilityRO,
  ResourceSettingsGeneralPropertiesRO,
  ResourceSettingsGeneralStatusRO,
  ResourceSettingsGeneralVisibilityRO,
  ResourceTimerRestrictionRO,
  ResourcesSettingsReservationGeneralRO,
  ResourcesSettingsReservationUnitRO,
} from '@/modules/resources/routes/RequestObject';

import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Resource } from '@/modules/resources/models/Resource';
import { ResourceRO } from '@/modules/resources/routes/RequestObject';
import { ResourceRate } from '@/modules/resources/models/ResourceRate';

export abstract class IResourceService extends IBaseService<any> {
  getResourcesOfAGivenOrganizationById: (organizationId: number) => Promise<Resource[]>;
  createResource: (userId: number, payload: ResourceRO) => Promise<number>;
  // updateResource: (payload: ResourceRO, resourceId: number) => Promise<number>;

  updateResourceReservationGeneral: (
    payload: ResourcesSettingsReservationGeneralRO,
    resourceId: number,
  ) => Promise<number>;

  updateResourceReservationUnits: (payload: ResourcesSettingsReservationUnitRO, resourceId: number) => Promise<number>;

  getResourceRate: (resourceId: number) => Promise<ResourceRate>;

  createResourceRate: (payload: ResourceRateRO, resourceId: number) => Promise<number>;

  updateResourceRate: (payload: ResourceRateRO, resourceRateId: number) => Promise<number>;

  updateResourceReservationTimerRestriction: (
    payload: ResourceTimerRestrictionRO,
    resourceRateId: number,
  ) => Promise<number>;

  updateResourceReservationVisibility: (
    payload: ResourceReservationVisibilityRO,
    resourceRateId: number,
  ) => Promise<number>;

  updateResourcesSettingsGeneralStatus: (
    payload: ResourceSettingsGeneralStatusRO,
    resourceId: number,
  ) => Promise<number>;
  updateResourcesSettingsGeneralVisibility: (
    payload: ResourceSettingsGeneralVisibilityRO,
    resourceId: number,
  ) => Promise<number>;
  updateResourcesSettingsnGeneralProperties: (
    payload: ResourceSettingsGeneralPropertiesRO,
    resourceId: number,
  ) => Promise<number>;

  getResourceSettings: (resourceId: number) => Promise<any>;
}
