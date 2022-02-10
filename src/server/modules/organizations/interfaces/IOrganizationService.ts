import { Result } from '@utils/Result';
import { OrganizationService } from '../services/OrganizationService';
import { CreateOrganizationRO } from '../routes/RequestObject';
import { Collection } from '@mikro-orm/core';
import { User } from '@modules/users/models/User';
import { IBaseService } from '@modules/base/interfaces/IBaseService';

export abstract class IOrganizationService extends IBaseService<any> {
  getInstance: () => OrganizationService;
  createOrganization: (payload: CreateOrganizationRO, userId: number) => Promise<Result<number>>;
  inviteUserByEmail: (email: string, orgId: number) => Promise<Result<number>>;
  getMembers: (orgId: number) => Promise<Result<Collection<User>>>;
}