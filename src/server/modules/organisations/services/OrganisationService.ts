import { container, provideSingleton } from '@di/index';

import { BaseService } from '@modules/base/services/BaseService';
import { CreateOrganizationRO } from '../routes/RequestObject';
import { OrganisationDao } from '../daos/OrganisationDao';
import { Organization } from '@modules/organisations/models/Organization';
import { UserDao } from '@modules/users/daos/UserDao';
import { wrap } from '@mikro-orm/core';

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
  public async createOrganization(payload: CreateOrganizationRO, userId: number): Promise<number> {
    try {
      const user = await this.userDao.get(userId);
      const organisation: { [key: string]: any } = {};
      organisation.name = payload.name;
      if (payload.parentId) {
        const existingOrg = await this.dao.getByCriteria({ id: payload.parentId });
        if (!existingOrg) {
          throw new Error('Organization parent does not exist');
        }
        organisation.parentId = organisation;
      }
      wrap(this.dao.model).assign(organisation, true);
      await user.organisations.init();
      user.organisations.add();

      return await this.create(this.dao.model);

      //get the group's id and save everything in db
    } catch (error) {
      // remove keycloak created role and group
      // since the organisation creation in the db failed
      return 0;
    }
  }
}
