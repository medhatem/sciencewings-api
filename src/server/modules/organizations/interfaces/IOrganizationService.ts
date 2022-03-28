import { CreateOrganizationRO, ResourceRO } from '@/modules/organizations/routes/RequestObject';
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
}
