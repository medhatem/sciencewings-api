import { Result } from '@utils/Result';
import { CreateOrganizationRO } from '../routes/RequestObject';
import { Collection } from '@mikro-orm/core';
import { User } from '@modules/users/models/User';
import { IBaseService } from '@modules/base/interfaces/IBaseService';
import { GetUserOrganizationDTO } from '../dtos/GetUserOrganizationDTO';

export abstract class IOrganizationService extends IBaseService<any> {
  createOrganization: (payload: CreateOrganizationRO, userId: number) => Promise<Result<number>>;
  inviteUserByEmail: (email: string, orgId: number) => Promise<Result<number>>;
  getMembers: (orgId: number) => Promise<Result<Collection<User>>>;
  getUserOrganizations: (userId: number) => Promise<Result<GetUserOrganizationDTO[]>>;
}
