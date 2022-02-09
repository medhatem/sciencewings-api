import { Result } from '@utils/Result';
import { OrganizationService } from '../services/OrganizationService';
import { CreateOrganizationRO } from '../routes/RequestObject';
import { Collection } from '@mikro-orm/core';
import { User } from '@modules/users/models/User';

export abstract class IOrganizationService {
  getInstance: () => OrganizationService;

  createOrganization: (payload: CreateOrganizationRO, userId: number) => Promise<Result<number>>;

  inviteUserByEmail: (email: string, orgId: number) => Promise<Result<number>>;

  getMembers: (orgId: number) => Promise<Result<Collection<User>>>;
}
