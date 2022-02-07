import { Collection } from '@mikro-orm/core';
import { User } from '@modules/users/models/User';
import { container, provideSingleton } from '@di/index';

import { BaseService } from '@modules/base/services/BaseService';
import { CreateOrganizationRO } from '../routes/RequestObject';
import { OrganisationDao } from '../daos/OrganisationDao';
import { Organization } from '@modules/organisations/models/Organization';
import { Result } from '@utils/Result';
import { UserDao } from '@modules/users/daos/UserDao';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';

@provideSingleton()
export class OrganisationService extends BaseService<Organization> {
  constructor(public dao: OrganisationDao, public userDao: UserDao) {
    super(dao);
  }

  static getInstance(): OrganisationService {
    return container.get(OrganisationService);
  }

  /**
   * create a new organisation
   * An organisation in keycloak is represented with a group
   * So we need to create the group first and get its id
   * Then we create the final organisation in the database by including the keycloak
   * group id
   *
   * @param payload
   */
  @log()
  @safeGuard()
  public async createOrganization(payload: CreateOrganizationRO, userId: number): Promise<Result<number>> {
    const existingOrg = await this.dao.getByCriteria({ name: payload.name });
    if (existingOrg) {
      return Result.fail<number>(`Organization ${payload.name} already exists.`);
    }
    const user = await this.userDao.get(userId);

    const organization = this.wrapEntity(this.dao.model, { name: payload.name });
    await user.organisations.init();
    user.organisations.add(organization);
    const createdOrg = await this.create(this.dao.model);
    if (payload.parentId) {
      const existingOrg = await this.dao.getByCriteria({ id: payload.parentId });
      if (!existingOrg) {
        return Result.fail<number>('Organization parent does not exist');
      }
      createdOrg.parent = existingOrg;
      await this.update(createdOrg);
    }

    return Result.ok<number>(createdOrg.id);
  }

  @log()
  @safeGuard()
  public async getMembers(orgId: number) {
    const existingOrg = await this.dao.get(orgId);

    if (!existingOrg) {
      return Result.fail<number>(`Organization with id ${orgId} does not exist.`);
    }

    const members: Collection<User> = await existingOrg.users.init();
    return Result.ok<Collection<User>>(members);
  }
}
