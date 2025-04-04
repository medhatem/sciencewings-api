import {
  CreateOrganizationRO,
  OrganizationAccessSettingsRO,
  OrganizationInvoicesSettingsRO,
  OrganizationlocalisationSettingsRO,
  OrganizationMemberSettingsRO,
  OrganizationReservationSettingsRO,
  UpdateOrganizationRO,
} from '@/modules/organizations/routes/RequestObject';

import { AddressRO } from '@/modules/address/routes/AddressRO';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { OrganizationSettings } from '@/modules/organizations/models/OrganizationSettings';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { Organization } from '@/modules/organizations/models/Organization';
import { MembersList } from '@/types/types';

export abstract class IOrganizationService extends IBaseService<any> {
  getOrganizationById: (organizationId: number) => Promise<Organization>;
  createOrganization: (payload: CreateOrganizationRO, userId: number) => Promise<number>;
  updateOrganizationGeneraleProperties: (payload: UpdateOrganizationRO, orgId: number) => Promise<number>;
  deleteOrganization: (orgId: number) => Promise<number>;
  addPhoneToOrganization: (payload: PhoneRO, orgId: number) => Promise<number>;
  addAddressToOrganization: (payload: AddressRO, orgId: number) => Promise<number>;
  getMembers: (
    orgId: number,
    statusFilter?: string,
    page?: number,
    size?: number,
    query?: string,
  ) => Promise<MembersList>;
  getOrganizationSettingsById: (organizationId: number) => Promise<OrganizationSettings>;
  updateOrganizationsSettingsProperties: (
    payload:
      | OrganizationMemberSettingsRO
      | OrganizationReservationSettingsRO
      | OrganizationInvoicesSettingsRO
      | OrganizationAccessSettingsRO,
    OrganizationId: number,
  ) => Promise<number>;
  updateOrganizationLocalisationSettings: (
    payload: OrganizationlocalisationSettingsRO,
    OrganizationId: number,
  ) => Promise<number>;
  getOrganizationLocalisation: (OrganizationId: number) => Promise<any>;
}
