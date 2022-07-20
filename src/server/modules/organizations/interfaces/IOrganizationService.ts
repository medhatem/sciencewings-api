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
import { Result } from '@/utils/Result';

export abstract class IOrganizationService extends IBaseService<any> {
  createOrganization: (payload: CreateOrganizationRO, userId: number) => Promise<number>;
  updateOrganizationGeneraleProperties: (payload: UpdateOrganizationRO, orgId: number) => Promise<Result<number>>;
  deleteOrganization: (orgId: number) => Promise<Result<number>>;
  addPhoneToOrganization: (payload: PhoneRO, orgId: number) => Promise<Result<number>>;
  addAddressToOrganization: (payload: AddressRO, orgId: number) => Promise<Result<number>>;
  getMembers: (orgId: number) => Promise<Result<Member[]>>;
  getOrganizationSettingsById: (organizationId: number) => Promise<Result<OrganizationSettings>>;
  updateOrganizationsSettingsProperties: (
    payload:
      | OrganizationMemberSettingsRO
      | OrganizationReservationSettingsRO
      | OrganizationInvoicesSettingsRO
      | OrganizationAccessSettingsRO,
    OrganizationId: number,
  ) => Promise<Result<number>>;
}
