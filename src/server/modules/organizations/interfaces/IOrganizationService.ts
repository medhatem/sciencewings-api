import {
  CreateOrganizationRO,
  OrganizationAccessSettingsRO,
  OrganizationGeneralSettingsRO,
  OrganizationInvoicesSettingsRO,
  OrganizationReservationSettingsRO,
  ResourceRO,
} from '@/modules/organizations/routes/RequestObject';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Member } from '@/modules/hr/models/Member';
import { Organization } from '@/modules/organizations/models/Organization';
import { Resource } from '@/modules/resources/models/Resource';
import { Result } from '@/utils/Result';
import { Collection } from '@mikro-orm/core';
import { OrganizationSettings } from '../models/OrganizationSettings';

export abstract class IOrganizationService extends IBaseService<any> {
  createOrganization: (payload: CreateOrganizationRO, userId: number) => Promise<Result<number>>;
  inviteUserByEmail: (email: string, orgId: number) => Promise<Result<number>>;
  resendInvite: (id: number, orgId: number) => Promise<Result<number>>;
  getMembers: (orgId: number) => Promise<Result<Collection<Member>>>;
  getUserOrganizations: (userId: number) => Promise<Result<Organization[]>>;
  getResourcesOfAGivenOrganizationById: (organizationId: number) => Promise<Result<Resource[]>>;
  createResource: (payload: ResourceRO) => Promise<Result<number>>;
  updateResource: (payload: ResourceRO, resourceId: number) => Promise<Result<number>>;
  //organization settings
  getOrganizationSettingsById: (organizationId: number) => Promise<Result<OrganizationSettings>>;
  updateOrganizationsSettingsnGeneralProperties: (
    payload: OrganizationGeneralSettingsRO,
    OrganizationId: number,
  ) => Promise<Result<number>>;
  updateOrganizationsSettingsProperties: (
    payload: OrganizationReservationSettingsRO | OrganizationInvoicesSettingsRO | OrganizationAccessSettingsRO,
    OrganizationId: number,
  ) => Promise<Result<number>>;
}
