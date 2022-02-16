import { container, provideSingleton } from '@di/index';

import { BaseService } from '../../base/services/BaseService';
import { Collection } from '@mikro-orm/core';
import { CreateOrganizationRO } from '../routes/RequestObject';
import { IOrganizationService } from '../interfaces/IOrganizationService';
import { Organization } from '../../organizations/models/Organization';
import { OrganizationDao } from '../daos/OrganizationDao';
import { Result } from '@utils/Result';
import { User } from '../../users/models/User';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';
import { EmailMessage } from '../../../types/types';
import { Email } from '@utils/Email';
import createSchema from '../schemas/createOrganizationSchema';
import { getConfig } from './../../../configuration/Configuration';
import { IPhoneService } from '../../phones/interfaces/IPhoneService';
import { IAddressService } from '../../address/interfaces/IAddressService';
import { IUserService } from '../../users/interfaces';
import { IOrganizationLabelService } from '../../organizations/interfaces/IOrganizationLabelService';
import { GetUserOrganizationDTO } from '../dtos/GetUserOrganizationDTO';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';

@provideSingleton(IOrganizationService)
export class OrganizationService extends BaseService<Organization> implements IOrganizationService {
  constructor(
    public dao: OrganizationDao,
    public userService: IUserService,
    public labelService: IOrganizationLabelService,
    public adressService: IAddressService,
    public phoneService: IPhoneService,
    public emailService: Email,
  ) {
    super(dao);
  }

  static getInstance(): IOrganizationService {
    return container.get(IOrganizationService);
  }

  @log()
  @safeGuard()
  @validate
  public async createOrganization(
    @validateParam(createSchema) payload: CreateOrganizationRO,
    userId: number,
  ): Promise<Result<number>> {
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

    const fetchedUser = await this.userService.getUserByCriteria({ id: userId });
    if (fetchedUser.isFailure) {
      return Result.fail<number>(`User with id: ${userId} parent does not exist`);
    }
    const user = fetchedUser.getValue();

    let adminContact;
    if (payload.adminContact) {
      adminContact = await this.userService.getUserByCriteria({ id: payload.adminContact });
      if (!adminContact) {
        return Result.fail<number>(`User with id: ${payload.adminContact} does not exist.`);
      }
    }

    let direction;
    if (payload.direction) {
      direction = await this.userService.getUserByCriteria({ id: payload.direction });
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
  async inviteUserByEmail(email: string, orgId: number): Promise<Result<number>> {
    const existingUser = await this.keycloak
      .getAdminClient()
      .users.find({ email, realm: getConfig('keycloak.clientValidation.realmName') });
    if (existingUser.length > 0) {
      return Result.fail<number>('The user already exist.');
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

  @log()
  @safeGuard()
  public async getUserOrganizations(userId: number): Promise<Result<GetUserOrganizationDTO[]>> {
    const user = await this.userService.getUserByCriteria({ id: userId });

    if (user.isFailure) {
      return Result.fail(user.error);
    }

    const fetchedUsersOrganization = await user.getValue().organizations.init();
    const organizations = fetchedUsersOrganization.toArray().map((org: Organization) => {
      return { id: org.id, name: org.name };
    });
    return Result.ok<GetUserOrganizationDTO[]>(organizations);
  }
}
