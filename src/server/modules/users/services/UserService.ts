import { ResetPasswordRO, UserDetailsRO } from '../routes/RequstObjects';
import { container, provideSingleton } from '@di/index';

import { BaseService } from '@modules/base/services/BaseService';
import { Email } from '@utils/Email';
import { EmailMessage } from '../../../types/types';
import { IOrganizationService } from '@modules/organizations/interfaces/IOrganizationService';
import { IUserService } from '../interfaces/IUserService';
import { Keycloak } from '@sdks/keycloak';
import { KeycloakUserInfo } from '../../../types/UserRequest';
import { PhoneService } from './PhoneService';
import { Result } from '@utils/Result';
import { User } from '@modules/users/models/User';
import { UserDao } from '../daos/UserDao';
import generateEmail from './generateEmail';
import { getConfig } from '../../../configuration/Configuration';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';

@provideSingleton(IUserService)
export class UserService extends BaseService<User> implements IUserService {
  constructor(
    public dao: UserDao,
    public phoneSerice: PhoneService,
    public organizationService: IOrganizationService,
    public keycloak: Keycloak = Keycloak.getInstance(),
    public emailService = Email.getInstance(),
  ) {
    super(dao);
  }

  static getInstance(): IUserService {
    return container.get(IUserService);
  }

  @log()
  @safeGuard()
  async updateUserDetails(payload: UserDetailsRO, userId: number): Promise<Result<number>> {
    const { phones } = payload;
    delete payload.phones;

    const userDetail = this.wrapEntity(this.dao.model, payload);
    const authedUser = await this.dao.get(userId);
    if (!authedUser) {
      return Result.fail<number>(`User with id ${userId} dose not existe`);
    }

    const user: User = {
      ...authedUser,
      ...userDetail,
    };

    await Promise.all(
      phones.map(async (p: any) => {
        await this.phoneSerice.createPhone(p);
      }),
    );

    await this.dao.update(user);

    return Result.ok<number>(userId);
  }

  @log()
  @safeGuard()
  async registerUser(userInfo: KeycloakUserInfo): Promise<Result<number>> {
    // get the userKeyCloakId
    const users = await this.keycloak.getAdminClient().users.find({ email: userInfo.email, realm: 'sciencewings-web' });

    if (!users || !users.length) {
      return Result.fail<number>('No user found');
    }
    const user = this.dao.model;
    user.firstname = userInfo.given_name;
    user.lastname = userInfo.family_name;
    user.email = userInfo.email;
    user.keycloakId = users[0].id;
    let createdUser: { [key: string]: any } = { id: null };
    try {
      createdUser = await this.dao.create(user);
    } catch (error) {
      return Result.fail<number>(error);
    }

    return Result.ok<number>(createdUser.id);
  }

  /**
   * fetches a user based on some search criteria
   *
   * @param criteria the search criteria
   */
  @log()
  @safeGuard()
  async getUserByCriteria(criteria: { [key: string]: any }) {
    return await this.dao.getByCriteria(criteria);
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

    const existingOrg = await this.organizationService.get(orgId);

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
    const user = this.dao.model;
    user.firstname = '';
    user.lastname = '';
    user.email = email;
    user.keycloakId = createdKeyCloakUser.id;
    const savedUser = await this.dao.create(user);

    // add the invited user to the organization
    await existingOrg.users.init();
    existingOrg.users.add(savedUser);

    await this.dao.update(savedUser);

    const emailMessage: EmailMessage = {
      from: this.emailService.from,
      to: email,
      text: 'Sciencewings - reset password',
      html: generateEmail(existingOrg.name),
      subject: 'Sciencewings - reset password',
    };

    this.emailService.sendEmail(emailMessage);

    return Result.ok<number>(savedUser.id);
  }

  /**
   * reset a user password
   *
   * @param payload
   */
  @log()
  @safeGuard()
  async resetPassword(payload: ResetPasswordRO): Promise<Result<string>> {
    if (payload.password !== payload.passwordConfirmation) {
      return Result.fail<string>("Passwords don't match");
    }
    const user = await this.dao.getByCriteria({ email: payload.email });

    if (!user) {
      return Result.fail<string>(`user with email: ${payload.email} does not exist.`);
    }

    await this.keycloak.getAdminClient().users.resetPassword({
      realm: getConfig('keycloak.clientValidation.realmName'),
      id: user.keycloakId,
      credential: {
        temporary: false,
        type: 'password',
        value: payload.password,
      },
    });

    return Result.ok<string>('Password reset successful');
  }
}
