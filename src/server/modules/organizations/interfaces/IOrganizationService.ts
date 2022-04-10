import {
  CreateOrganizationRO,
  ResourceRO,
  ResourcesSettingsReservationGeneralRO,
  ResourcesSettingsReservationUnitRO,
  ResourceRateRO,
  ResourceTimerRestrictionRO,
} from '@/modules/organizations/routes/RequestObject';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Member } from '@/modules/hr/models/Member';
import { Organization } from '@/modules/organizations/models/Organization';
import { Resource } from '@/modules/resources/models/Resource';
import { Result } from '@/utils/Result';
import { Collection } from '@mikro-orm/core';

export abstract class IOrganizationService extends IBaseService<any> {
  createOrganization: (payload: CreateOrganizationRO, userId: number) => Promise<Result<number>>;
  inviteUserByEmail: (email: string, orgId: number) => Promise<Result<number>>;
  resendInvite: (id: number, orgId: number) => Promise<Result<number>>;
  getMembers: (orgId: number) => Promise<Result<Collection<Member>>>;
  getUserOrganizations: (userId: number) => Promise<Result<Organization[]>>;
  getResourcesOfAGivenOrganizationById: (organizationId: number) => Promise<Result<Resource[]>>;
  createResource: (payload: ResourceRO) => Promise<Result<number>>;
  updateResource: (payload: ResourceRO, resourceId: number) => Promise<Result<number>>;

  updateResourceSettingsReservationGeneral: (
    payload: ResourcesSettingsReservationGeneralRO,
    resourceId: number,
  ) => Promise<Result<number>>;
  updateResourceSettingsReservationUnits: (
    payload: ResourcesSettingsReservationUnitRO,
    resourceId: number,
  ) => Promise<Result<number>>;

  createResourceRate: (payload: ResourceRateRO) => Promise<Result<number>>;
  updateResourceRate: (payload: ResourceRateRO, resourceRateId: number) => Promise<Result<number>>;

  updateResourceTimerRestriction: (
    payload: ResourceTimerRestrictionRO,
    resourceRateId: number,
  ) => Promise<Result<number>>;
}
