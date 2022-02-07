import { Collection } from '@mikro-orm/core';
import { Email } from '@utils/Email';
import { User } from '@modules/users/models/User';
import { OrganisationContactDao } from './../daos/OrganizationContactDao';
import { OrganisationLabelDao } from './../daos/OrganizationLabelDao';
import { container, provideSingleton } from '@di/index';
import { BaseService } from '@modules/base/services/BaseService';
import { CreateOrganizationRO } from '../routes/RequestObject';
import { OrganisationDao } from '../daos/OrganisationDao';
import { Organization } from '@modules/organisations/models/Organization';
import { UserService } from '@modules/users/services/UserService';
import { Result } from '@utils/Result';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';
import { EmailMessage } from '../../../types/types';
import { getConfig } from './../../../configuration/Configuration';
import { AddressDao } from '@modules/base/daos/AddressDAO';
@provideSingleton()
export class OrganisationService extends BaseService<Organization> {
  constructor(
    public dao: OrganisationDao,
    public userService: UserService,
    public labelDAO: OrganisationLabelDao,
    public contactDAO: OrganisationContactDao,
    public addressDAO: AddressDao,
    public emailService = Email.getInstance(),
  ) {
    super(dao);
  }

  static getInstance(): OrganisationService {
    return container.get(OrganisationService);
  }

  // /**
  //  * create a new organisation
  //  * An organisation in keycloak is represented with a group
  //  * So we need to create the group first and get its id
  //  * Then we create the final organisation in the database by including the keycloak
  //  * group id
  //  *
  //  * @param payload
  //  */
  @log()
  @safeGuard()
  public async createOrganization(payload: CreateOrganizationRO, userId: number): Promise<Result<number>> {
    const existingOrg = await this.dao.getByCriteria({ name: payload.name });
    if (existingOrg) {
      return Result.fail<number>(`Organization ${payload.name} already exists.`);
    }

    const user = await this.userService.get(userId);

    let adminContact;
    if (payload.adminContact) {
      adminContact = await this.userService.get(payload.adminContact);
      if (!adminContact) {
        throw new Error(`User with id: ${payload.adminContact} dose not exists.`);
      }
    }

    let direction;
    if (payload.direction) {
      direction = await this.userService.get(payload.direction);
      if (!direction) {
        throw new Error(`User with id: ${payload.direction} dose not exists.`);
      }
    }

    const organization = this.wrapEntity(this.dao.model, {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      type: payload.type,
      social_facebook: payload.social_facebook,
      social_instagram: payload.social_instagram,
      social_youtube: payload.social_youtube,
      social_github: payload.social_github,
      social_twitter: payload.social_twitter,
      social_linkedin: payload.social_linkedin,
    });
    organization.direction = direction;
    organization.admin_contact = adminContact;

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

    await Promise.all(
      payload.labels.map(async (el: string) => {
        await this.labelDAO.create({
          id: null,
          toJSON: null,
          name: el,
          organisation: createdOrg,
        });
      }),
    );

    await Promise.all(
      payload.address.map(async (el: any) => {
        await this.addressDAO.create({
          id: null,
          toJSON: null,
          country: el.country,
          province: el.province,
          code: el.code,
          type: el.type,
          street: el.street,
          appartement: el.appartement,
          city: el.city,
          organisation: createdOrg,
        });
      }),
    );

    await Promise.all(
      payload.members.map(async (el: number) => {
        const user = await this.userService.get(el);
        if (user) createdOrg.members.add(user);
      }),
    );

    await this.update(createdOrg);
    return Result.ok<number>(createdOrg.id);
  }

  @log()
  @safeGuard()
  async inviteUserByEmail(email: string, orgId: number): Promise<Result<number>> {
    const existingUser = await this.keycloak
      .getAdminClient()
      .users.find({ email, realm: getConfig('keycloak.clientValidation.realmName') });
    if (existingUser.length > 0) {
      return Result.fail<number>('The user already exists.');
    }

    const existingOrg = await this.dao.get(orgId);

    if (!existingOrg) {
      return Result.fail<number>('The organization to add the user to does not exist.');
    }

    const createdKeyCloakUser = await this.keycloak.getAdminClient().users.create({
      email,
      firstName: '',
      lastName: '',
      realm: getConfig('keycloak.clientValidation.realmName'),
    });

    //save created keycloak user in the database
    const user = new User();
    user.firstname = '';
    user.lastname = '';
    user.email = email;
    user.keycloakId = createdKeyCloakUser.id;

    const savedUser = await this.userService.create(user);

    // add the invited user to the organization
    await existingOrg.members.init();
    existingOrg.members.add(savedUser);

    await this.userService.update(savedUser);

    const emailMessage: EmailMessage = {
      from: this.emailService.from,
      to: email,
      text: 'Sciencewings - reset password',
      html: '<html><body>Reset password</body></html>',
      subject: ' reset password',
    };

    this.emailService.sendEmail(emailMessage);

    return Result.ok<number>(savedUser.id);
  }

  public async getMembers(orgId: number) {
    const existingOrg = await this.dao.get(orgId);

    if (!existingOrg) {
      return Result.fail<number>(`Organization with id ${orgId} does not exist.`);
    }

    const members: Collection<User> = await existingOrg.members.init();
    return Result.ok<Collection<User>>(members);
  }
}
