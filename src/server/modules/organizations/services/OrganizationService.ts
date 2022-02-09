import { AddressService } from '@modules/address/services/AddressService';
import { OrganisationLabelService } from './OrganisationLabelService';
import { getConfig } from '../../../configuration/Configuration';
import { Collection } from '@mikro-orm/core';
import { User } from '@modules/users/models/User';
import { container, provideSingleton } from '@di/index';
import { BaseService } from '@modules/base/services/BaseService';
import { CreateOrganizationRO } from '@modules/organizations/routes/RequestObject';
import { OrganizationDao } from '@modules/organizations/daos/OrganizationDao';
import { Organization } from '@modules/organizations/models/Organization';
import { Result } from '@utils/Result';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';
import { UserService } from '@modules/users/services/UserService';
import { EmailMessage } from '../../../types/types';
import { Email } from '@utils/Email';
import { validate } from '../../../decorators/bodyValidationDecorators/validate';
import createSchema from '../schemas/createOrganizationSchema';
import { PhoneService } from '@modules/phones/services/PhoneService';

@provideSingleton()
export class OrganizationService extends BaseService<Organization> {
  constructor(
    public dao: OrganizationDao,
    public userService: UserService,
    public labelService: OrganisationLabelService,
    public adressService: AddressService,
    public phoneService: PhoneService,
    public emailService: Email,
  ) {
    super(dao);
  }

  static getInstance(): OrganizationService {
    return container.get(OrganizationService);
  }

  @log()
  @safeGuard()
  @validate(createSchema)
  public async createOrganization(payload: CreateOrganizationRO, userId: number): Promise<Result<number>> {
    const existingOrg = await this.dao.getByCriteria({ name: payload.name });
    if (existingOrg) {
      return Result.fail<number>(`Organization ${payload.name} already exists.`);
    }

    if (payload.parentId) {
      const org = await this.dao.getByCriteria({ id: payload.parentId });
      if (!org) {
        return Result.fail<number>('Organization parent does not exist');
      }
    }

    const user = await this.userService.get(userId);

    let adminContact;
    if (payload.adminContact) {
      adminContact = await this.userService.get(payload.adminContact);
      if (!adminContact) {
        return Result.fail<number>(`User with id: ${payload.adminContact} does not exists.`);
      }
    }

    let direction;
    if (payload.direction) {
      direction = await this.userService.get(payload.direction);
      if (!direction) {
        return Result.fail<number>(`User with id: ${payload.direction} does not exists.`);
      }
    }

    const organization = this.wrapEntity(this.dao.model, {
      name: payload.name,
      email: payload.email,
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

    await user.organizations.init();
    user.organizations.add(organization);
    const _createdOrg = await this.create(organization);

    if (_createdOrg.isFailure) {
      return Result.fail<number>(_createdOrg.error);
    }

    const createdOrg = await _createdOrg.getValue();

    createdOrg.parent = existingOrg;
    await this.update(createdOrg);

    if (payload.address.length) this.adressService.createBulkAddress(payload.address);

    if (payload.phones.length) this.phoneService.createBulkPhoneForOrganization(payload.phones, createdOrg);

    if (payload.labels.length) this.labelService.createBulkLabel(payload.labels, createdOrg);

    let flagError = false;
    await Promise.all(
      payload.members.map(async (el: number) => {
        const user = await this.userService.get(el);
        if (!user) {
          flagError = true;
        }
        if (user) createdOrg.members.add(user);
      }),
    );

    if (flagError) {
      return Result.fail<number>(`User in members does not exists.`);
    }

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
      return Result.fail<number>('The organization to add the user to does not exists.');
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

    if (savedUser.isFailure) {
      return Result.fail<number>(savedUser.error);
    }

    // add the invited user to the organization
    await existingOrg.members.init();
    existingOrg.members.add(savedUser.getValue());

    await this.userService.update(savedUser.getValue());

    const emailMessage: EmailMessage = {
      from: this.emailService.from,
      to: email,
      text: 'Sciencewings - reset password',
      html: '<html><body>Reset password</body></html>',
      subject: ' reset password',
    };

    this.emailService.sendEmail(emailMessage);

    return Result.ok<number>(savedUser.getValue().id);
  }

  @log()
  @safeGuard()
  public async getMembers(orgId: number) {
    const existingOrg = await this.dao.get(orgId);

    if (!existingOrg) {
      return Result.fail<number>(`Organization with id ${orgId} does not exists.`);
    }

    const members: Collection<User> = await existingOrg.members.init();
    return Result.ok<Collection<User>>(members);
  }
}
