import { ResetPasswordRO, UserDetailsRO } from '../routes/RequstObjects';
import { container, provideSingleton } from '@di/index';
import { BaseService } from '@modules/base/services/BaseService';
import { Email } from '@utils/Email';
import { IUserService } from '@modules/users/interfaces/IUserService';
import { Keycloak } from '@sdks/keycloak';
import { KeycloakUserInfo } from '../../../types/UserRequest';
import { Result } from '@utils/Result';
import { User } from '@modules/users/models/User';
import { UserDao } from '../daos/UserDao';
import { getConfig } from '../../../configuration/Configuration';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';
import { IPhoneService } from '@modules/phones/interfaces/IPhoneService';

@provideSingleton(IUserService)
export class UserService extends BaseService<User> implements IUserService {
  constructor(
    public dao: UserDao,
    public phoneSerice: IPhoneService,
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
      return Result.fail<number>(`User with id ${userId} does not exist`);
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
      return Result.fail(error);
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
  async getUserByCriteria(criteria: { [key: string]: any }): Promise<Result<User>> {
    const user = await this.dao.getByCriteria(criteria);
    return Result.ok<User>(user);
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

  @log()
  @safeGuard()
  async create(user: User): Promise<Result<User>> {
    let createdUser;
    try {
      createdUser = await this.dao.create(user);
    } catch (error) {
      return Result.fail(error);
    }
    return Result.ok<User>(createdUser);
  }

  @log()
  @safeGuard()
  async update(user: User): Promise<Result<User>> {
    let newUser = await this.dao.get(user.id);
    if (!newUser) return Result.fail(`User with id ${user.id} does not exist.`);
    try {
      newUser = await this.dao.update(user);
    } catch (error) {
      return Result.fail(error);
    }
    return Result.ok<User>(newUser);
  }
}
