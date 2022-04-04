import {
  CreateOrganizationRO,
  ResourceRO,
  ResourcesSettingsReservationGeneralRO,
  ResourcesSettingsReservationUnitRO,
  ResourceRateRO,
  ResourceTimerRestrictionRO,
  ResourceReservationVisibilityRO,
} from '@/modules/organizations/routes/RequestObject';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Member } from '@/modules/hr/models/Member';
import { Organization } from '@/modules/organizations/models/Organization';
import { Resource } from '@/modules/resources/models/Resource';
import { Result } from '@/utils/Result';

export abstract class IOrganizationService extends IBaseService<any> {
  createOrganization: (payload: CreateOrganizationRO, userId: number) => Promise<Result<number>>;
  inviteUserByEmail: (email: string, orgId: number) => Promise<Result<number>>;
  getMembers: (orgId: number) => Promise<Result<Member[]>>;
  getUserOrganizations: (userId: number) => Promise<Result<Organization[]>>;

  getResourcesOfAGivenOrganizationById: (organizationId: number) => Promise<Result<Resource[]>>;
  createResource: (payload: ResourceRO) => Promise<Result<number>>;
  updateResource: (payload: ResourceRO, resourceId: number) => Promise<Result<number>>;

  getResourceReservationGeneral: (resourceId: number) => Promise<Result<any>>;
  updateResourceReservationGeneral: (
    payload: ResourcesSettingsReservationGeneralRO,
    resourceId: number,
  ) => Promise<Result<number>>;
  updateResourceReservationUnits: (
    payload: ResourcesSettingsReservationUnitRO,
    resourceId: number,
  ) => Promise<Result<number>>;

  getResourceReservationUnites: (resourceId: number) => Promise<Result<any>>;

  getResourceReservationRate: (resourceId: number) => Promise<Result<any>>;
  createResourceRate: (payload: ResourceRateRO, resourceId: number) => Promise<Result<number>>;
  updateResourceRate: (payload: ResourceRateRO, resourceRateId: number) => Promise<Result<number>>;

  getResourceReservationTimerRestriction: (resourceId: number) => Promise<Result<any>>;
  updateResourceReservationTimerRestriction: (
    payload: ResourceTimerRestrictionRO,
    resourceRateId: number,
  ) => Promise<Result<number>>;

  getResourceReservationVisibility: (resourceId: number) => Promise<Result<any>>;
  updateResourceReservationVisibility: (
    payload: ResourceReservationVisibilityRO,
    resourceId: number,
  ) => Promise<Result<number>>;
}
