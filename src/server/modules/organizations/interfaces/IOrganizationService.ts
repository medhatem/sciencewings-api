import { Collection } from '@mikro-orm/core';
import { CreateOrganizationRO } from '../routes';
import { IBaseService } from '@modules/base/interfaces/IBaseService';
import { Result } from '@utils/Result';
import { User } from '@modules/users/models/User';

export abstract class IOrganizationService extends IBaseService<any> {
  createOrganization: (payload: CreateOrganizationRO, userId: number) => Promise<Result<number>>;

  getMembers: (orgId: number) => Promise<Result<Collection<User>>>;
}
