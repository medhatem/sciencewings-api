import { CreateOrganizationRO, ResourceRO, UpdateOrganizationRO } from '@/modules/organizations/routes/RequestObject';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Member } from '@/modules/hr/models/Member';
import { Organization } from '@/modules/organizations/models/Organization';
import { Resource } from '@/modules/resources/models/Resource';
import { Result } from '@/utils/Result';
import { Collection } from '@mikro-orm/core';
import { createOrganizationPhoneRO, DeletedPhoneRO, PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { AddressRO, DeletedAddressRO, UpdateAddressRO } from '@/modules/address/routes/AddressRO';

export abstract class IOrganizationService extends IBaseService<any> {
  createOrganization: (payload: CreateOrganizationRO, userId: number) => Promise<Result<number>>;
  updateOrganizationGeneraleProperties: (payload: UpdateOrganizationRO, orgId: number) => Promise<Result<number>>;
  //organization phone crud
  createOrganizationPhone: (payload: createOrganizationPhoneRO, orgId: number) => Promise<Result<number>>;
  updateOrganizationPhone: (payload: PhoneRO, orgId: number) => Promise<Result<number>>;
  removeOrganizationPhone: (payload: DeletedPhoneRO, orgId: number) => Promise<Result<number>>;
  //organization address crud
  createOrganizationAdress: (payload: AddressRO, orgId: number) => Promise<Result<number>>;
  updateOrganizationAddress: (payload: UpdateAddressRO, orgId: number) => Promise<Result<number>>;
  removeOrganizationAddress: (payload: DeletedAddressRO, orgId: number) => Promise<Result<number>>;
  inviteUserByEmail: (email: string, orgId: number) => Promise<Result<number>>;
  resendInvite: (id: number, orgId: number) => Promise<Result<number>>;
  getMembers: (orgId: number) => Promise<Result<Collection<Member>>>;
  getUserOrganizations: (userId: number) => Promise<Result<Organization[]>>;
  getResourcesOfAGivenOrganizationById: (organizationId: number) => Promise<Result<Resource[]>>;
  createResource: (payload: ResourceRO) => Promise<Result<number>>;
  updateResource: (payload: ResourceRO, resourceId: number) => Promise<Result<number>>;
}
