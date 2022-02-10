import { container, provideSingleton } from '@di/index';
import { BaseService } from '@modules/base/services/BaseService';
import { Collection } from '@mikro-orm/core';
import { CreateOrganizationRO } from '../routes/RequestObject';
import { IOrganizationService } from '../interfaces/IOrganizationService';
import { Organization } from '@modules/organizations/models/Organization';
import { OrganizationDao } from '../daos/OrganizationDao';
import { Result } from '@utils/Result';
import { User } from '@modules/users/models/User';
import { UserDao } from '@modules/users/daos/UserDao';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';
import { EmailMessage } from '../../../types/types';
import { Email } from '@utils/Email';
import { validate } from '../../../decorators/bodyValidationDecorators/validate';
import createSchema from '../schemas/createOrganizationSchema';
import { UserService } from '@modules/users/services/UserService';
import { OrganisationLabelService } from './OrganisationLabelService';
import { AddressService } from '@modules/address/services/AddressService';
import { PhoneService } from '@modules/phones/services/PhoneService';

@provideSingleton(IOrganizationService)
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
      return Result.fail<number>(`Organization ${payload.name} already exist.`);
    }

    if (payload.parentId) {
      const org = await this.dao.getByCriteria({ id: payload.parentId });
      if (!org) {
        return Result.fail<number>('Organization parent does not exist');
      }
    }

    const _user = await this.userService.getUserByCriteria({ id: userId });
    if (!_user) {
      return Result.fail<number>(`User with id: ${userId} parent does not exist`);
    }
    const user = _user.getValue();

    let adminContact;
    if (payload.adminContact) {
      adminContact = await this.userService.getUserByCriteria({ adminContact: payload.adminContact });
      if (!adminContact) {
        return Result.fail<number>(`User with id: ${payload.adminContact} does not exist.`);
      }
    }

    let direction;
    if (payload.direction) {
      direction = await this.userService.getUserByCriteria({ direction: payload.direction });
      if (!direction) {
        return Result.fail<number>(`User with id: ${payload.direction} does not exist.`);
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
    organization.direction = await direction.getValue();
    organization.admin_contact = await adminContact.getValue();

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
        const user = await this.userService.getUserByCriteria({ id: el });
        if (user.isFailure || !user) {
          flagError = true;
        }
        if (user) createdOrg.members.add(user.getValue());
      }),
    );

    if (flagError) {
      return Result.fail<number>(`User in members does not exist.`);
    }

    await this.update(createdOrg);
    return Result.ok<number>(createdOrg.id);
  }

  @log()
  @safeGuard()
  public async getMembers(orgId: number): Promise<Result<Collection<User>>> {
    const existingOrg = await this.dao.get(orgId);

    if (!existingOrg) {
      return Result.fail<Collection<User>>(`Organization with id ${orgId} does not exist.`);
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
  public async getMembers(orgId: number): Promise<Result<Collection<User>>> {
    const existingOrg = await this.dao.get(orgId);

    if (!existingOrg) {
      return Result.fail(`Organization with id ${orgId} does not exist.`);
    }

    const members: Collection<User> = await existingOrg.members.init();
    return Result.ok<Collection<User>>(members);
  }
}
