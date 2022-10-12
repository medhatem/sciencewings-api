import {
  CreateOrganizationRO,
  OrganizationAccessSettingsRO,
  OrganizationInvoicesSettingsRO,
  OrganizationMemberSettingsRO,
  OrganizationReservationSettingsRO,
  UpdateOrganizationRO,
} from '@/modules/organizations/routes/RequestObject';

import { AddressRO } from '@/modules/address/routes/AddressRO';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Member } from '@/modules/hr/models/Member';
import { OrganizationSettings } from '@/modules/organizations/models/OrganizationSettings';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { Organization } from '@/modules/organizations/models/Organization';

export abstract class IOrganizationService extends IBaseService<any> {
  getOrganizationById: (organizationId: number) => Promise<Organization>;
  createOrganization: (payload: CreateOrganizationRO, userId: number) => Promise<number>;
  updateOrganizationGeneraleProperties: (payload: UpdateOrganizationRO, orgId: number) => Promise<number>;
  deleteOrganization: (orgId: number) => Promise<number>;
  addPhoneToOrganization: (payload: PhoneRO, orgId: number) => Promise<number>;
  addAddressToOrganization: (payload: AddressRO, orgId: number) => Promise<number>;
  getMembers: (orgId: number, statusFilter: string, page?: number, size?: number) => Promise<Member[]>;
  getOrganizationSettingsById: (organizationId: number) => Promise<OrganizationSettings>;
  updateOrganizationsSettingsProperties: (
    payload:
      | OrganizationMemberSettingsRO
      | OrganizationReservationSettingsRO
      | OrganizationInvoicesSettingsRO
      | OrganizationAccessSettingsRO,
    OrganizationId: number,
  ) => Promise<number>;
}
