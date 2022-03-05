import { Collection } from '@mikro-orm/core';
import { CreateOrganizationRO } from '@/modules/organizations/routes/RequestObject';
import { GetUserOrganizationDTO } from '@/modules/organizations/dtos/GetUserOrganizationDTO';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Member } from '@/modules/hr/models/Member';
import { Result } from '@/utils/Result';

export abstract class IOrganizationService extends IBaseService<any> {
  createOrganization: (payload: CreateOrganizationRO, userId: number) => Promise<Result<number>>;
  inviteUserByEmail: (email: string, orgId: number) => Promise<Result<number>>;
  getMembers: (orgId: number) => Promise<Result<Collection<Member>>>;
  getUserOrganizations: (userId: number) => Promise<Result<GetUserOrganizationDTO[]>>;
}
