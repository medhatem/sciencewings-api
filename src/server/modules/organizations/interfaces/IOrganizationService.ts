import { CreateOrganizationRO, UpdateOrganizationRO } from '@/modules/organizations/routes/RequestObject';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Member } from '@/modules/hr/models/Member';
import { Organization } from '@/modules/organizations/models/Organization';
import { Result } from '@/utils/Result';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { AddressRO } from '@/modules/address/routes/AddressRO';

export abstract class IOrganizationService extends IBaseService<any> {
  createOrganization: (payload: CreateOrganizationRO, userId: number) => Promise<Result<number>>;
  updateOrganizationGeneraleProperties: (payload: UpdateOrganizationRO, orgId: number) => Promise<Result<number>>;
  deleteOrganization: (orgId: number) => Promise<Result<number>>;
  addPhoneToOrganization: (payload: PhoneRO, orgId: number) => Promise<Result<number>>;
  addAddressToOrganization: (payload: AddressRO, orgId: number) => Promise<Result<number>>;
  getMembers: (orgId: number) => Promise<Result<Member[]>>;
  getUserOrganizations: (userId: number) => Promise<Result<Organization[]>>;
}
