import { OrganisationContactDao } from './../daos/OrganizationContactDao';
import { OrganisationSocialDao } from './../daos/OrganizationSocialDao';
import { OrganisationLabelDao } from './../daos/OrganizationLabelDao';
import { container, provideSingleton } from '@di/index';

import { BaseService } from '@modules/base/services/BaseService';
import { CreateOrganizationRO } from '../routes/RequestObject';
import { OrganisationDao } from '../daos/OrganisationDao';
import { Organization } from '@modules/organisations/models/Organization';
import { UserDao } from '@modules/users/daos/UserDao';

@provideSingleton()
export class OrganisationService extends BaseService<Organization> {
  constructor(
    public dao: OrganisationDao,
    public userDao: UserDao,
    public labelDAO: OrganisationLabelDao,
    public socialDAO: OrganisationSocialDao,
    public contactDAO: OrganisationContactDao,
  ) {
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
    const existingOrg = await this.dao.getByCriteria({ name: payload.name });
    if (existingOrg) {
      throw new Error(`Organization ${payload.name} already exists.`);
    }
    const user = await this.userDao.get(userId);

    const direction = await this.userDao.get(payload.contact);
    if (direction) {
      throw new Error(`User with id: ${payload.contact} dose not exists.`);
    }

    const adminContact = await this.userDao.get(payload.adminContact);
    if (adminContact) {
      throw new Error(`User with id: ${payload.adminContact} dose not exists.`);
    }

    const organization = this.wrapEntity(this.dao.model, {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      type: payload.type,
      direction: direction,
      adminContact: adminContact,
    });
    await user.organisations.init();
    user.organisations.add(organization);
    const createdOrg = await this.create(this.dao.model);
    if (payload.parentId) {
      const existingOrg = await this.dao.getByCriteria({ id: payload.parentId });
      if (!existingOrg) {
        throw new Error('Organization parent does not exist');
      }
      createdOrg.parent = existingOrg;
      await this.update(createdOrg);
    }

    payload.labels.map((el: string) => {
      this.labelDAO.create({
        id: null,
        toJSON: null,
        name: el,
        organisation: createdOrg,
      });
    });

    payload.social.map((el: any) => {
      this.socialDAO.create({
        id: null,
        toJSON: null,
        type: el.type,
        link: el.link,
        organisation: createdOrg,
      });
    });

    await Promise.all(
      payload.members.map(async (el: number) => {
        const user = await this.userDao.get(el);
        if (user) createdOrg.members.add(user);
      }),
    );

    await this.update(createdOrg);

    return createdOrg.id;
  }
}
