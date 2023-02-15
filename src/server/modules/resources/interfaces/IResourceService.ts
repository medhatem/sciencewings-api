import {
  ResourceRateRO,
  ResourceReservationVisibilityRO,
  ResourceSettingsGeneralPropertiesRO,
  ResourceSettingsGeneralStatusRO,
  ResourceSettingsGeneralVisibilityRO,
  ResourceTimerRestrictionRO,
  ResourcesSettingsReservationGeneralRO,
  ResourcesSettingsReservationUnitRO,
  UpdateResourceRO,
} from '@/modules/resources/routes/RequestObject';

import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { ResourceRO } from '@/modules/resources/routes/RequestObject';
import { ResourceRate } from '@/modules/resources/models/ResourceRate';
import { ResourcesList } from '@/types/types';
import { Resource } from '@/modules/resources/models/Resource';

export abstract class IResourceService extends IBaseService<any> {
  getResourcesOfAGivenOrganizationById: (
    organizationId: number,
    page?: number,
    size?: number,
    query?: string,
  ) => Promise<ResourcesList>;
  getResourceById: (resourceId: number) => Promise<Resource>;
  getAllLoanableResources: (category?: string, query?: string) => Promise<Resource[]>;
  createResource: (userId: number, payload: ResourceRO) => Promise<number>;
  updateResource: (payload: UpdateResourceRO, resourceId: number) => Promise<number>;

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

  deleteResourceManager: (resourceId: number, managerId: number) => Promise<number>;

  addResourceManager: (resourceId: number, managerId: number) => Promise<number>;

  getAllResourceManagers: (resourceId: number) => Promise<any>;

  getLonabaleResources: () => Promise<any>;
}
