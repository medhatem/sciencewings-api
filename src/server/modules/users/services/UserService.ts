import { IAddressService } from '@/modules/address/interfaces/IAddressService';
import { IPhoneService } from '@/modules/phones/interfaces/IPhoneService';
import { applyToAll } from '@/utils/utilities';
import { ResetPasswordRO } from '@/modules/users/routes/RequstObjects';
import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { Email } from '@/utils/Email';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { Keycloak } from '@/sdks/keycloak';
import { KeycloakUserInfo } from '@/types/UserRequest';
import { Result } from '@/utils/Result';
import { User, userStatus } from '@/modules/users/models/User';
import { UserDao } from '@/modules/users/daos/UserDao';
import { UserRO } from '@/modules/users/routes/RequstObjects';
import { getConfig } from '@/configuration/Configuration';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';
import { validateParam } from '@/decorators/validateParam';
import { CreateUserSchema, UpdateUserSchema } from '@/modules/users/schemas/UserSchema';
import { validate } from '@/decorators/validate';

@provideSingleton(IUserService)
export class UserService extends BaseService<User> implements IUserService {
  constructor(
    public dao: UserDao,
    public addressService: IAddressService,
    public phoneService: IPhoneService,
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
  async updateUserDetails(payload: UserRO, userId: number): Promise<Result<number>> {
    const userDetail = this.wrapEntity(this.dao.model, {
      email: payload.email,
      firstname: payload.firstname,
      lastname: payload.lastname,
      addresses: payload.addresses,
      phones: payload.phones,
      dateofbirth: payload.dateofbirth,
      signature: payload.signature,
      actionId: payload.actionId,
      share: payload.share,
    });
    const authedUser = await this.dao.get(userId);
    if (!authedUser) {
      return Result.notFound(`User with id ${userId} does not exist`);
    }

    const user: User = {
      ...authedUser,
      ...userDetail,
    };

    await this.dao.update(user);

    return Result.ok<number>(userId);
  }

  @log()
  @safeGuard()
  async registerUser(userInfo: KeycloakUserInfo): Promise<Result<number>> {
    // get the userKeyCloakId
    const users = await this.keycloak
      .getAdminClient()
      .users.find({ email: userInfo.email, realm: getConfig('keycloak.clientValidation.realmName') });

    if (!users || !users.length) {
      return Result.notFound<number>('No user found');
    }
    const user = new User();
    user.firstname = userInfo.given_name;
    user.lastname = userInfo.family_name;
    user.email = userInfo.email;
    user.keycloakId = users[0].id;
    let createdUser: { [key: string]: any } = { id: null };
    createdUser = await this.dao.create(user);

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
    try {
      const user = (await this.dao.getByCriteria(criteria)) as User;
      return Result.ok<User>(user);
    } catch (error) {
      return Result.fail(error);
    }
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
    const user = (await this.dao.getByCriteria({ email: payload.email })) as User;

    if (!user) {
      return Result.notFound<string>(`user with email: ${payload.email} does not exist.`);
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
    user.status = userStatus.ACTIVE;
    return Result.ok<string>('Password reset successful');
  }

  @log()
  @safeGuard()
  @validate
  async createUser(@validateParam(CreateUserSchema) user: UserRO): Promise<Result<User>> {
    try {
      const userExistingCheck: User = (await this.dao.getByCriteria({
        $or: [{ email: user.email }, { keycloakId: user.keycloakId }],
      })) as User;
      if (userExistingCheck) {
        return Result.fail(`user already exists `);
      }
      const userAddress = user.addresses;
      const userPhones = user.phones;

      const createdUser = await this.dao.create({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        dateofbirth: user.dateofbirth,
        keycloakId: user.keycloakId,
      });

      createdUser.address = await createdUser.address.init();
      createdUser.phones = await createdUser.phones.init();

      await applyToAll(userAddress, async (address) => {
        const createdAddress = await this.addressService.create({
          city: address.city,
          apartment: address.apartment,
          country: address.country,
          code: address.code,
          province: address.province,
          street: address.street,
          type: address.type,
          user: createdUser,
        });
        if (!createdAddress.isFailure) {
          createdUser.address.add(createdAddress.getValue());
        }
      });

      await applyToAll(userPhones, async (phone) => {
        const createdPhone = await this.phoneService.create({
          phoneLabel: phone.phoneLabel,
          phoneCode: phone.phoneCode,
          phoneNumber: phone.phoneNumber,
          user: createdUser,
        });
        if (!createdPhone.isFailure) {
          createdUser.phones.add(createdPhone.getValue());
        }
      });

      this.dao.repository.flush();
      console.log({ createdUser });
      const fetchdUser: User = await this.dao.get(createdUser.id);
      return Result.ok<User>(fetchdUser);
    } catch (error) {
      console.log({ error });
      return Result.fail(error);
    }
  }

  @log()
  @safeGuard()
  @validate
  async updateUserByKeycloakId(
    @validateParam(UpdateUserSchema) user: UserRO,
    keycloakId: string,
  ): Promise<Result<User>> {
    const fetchedUser = (await this.dao.getByCriteria({ keycloakId })) as User;

    if (!fetchedUser) {
      return Result.notFound(`User with KCID ${keycloakId} does not exist.`);
    }
    try {
      const updateUser = await this.dao.update(
        this.wrapEntity(fetchedUser, {
          ...fetchedUser,
          ...user,
        }),
      );
      return Result.ok<User>(updateUser);
    } catch (error) {
      return Result.fail(error);
    }
  }

  @log()
  @safeGuard()
  async getUserByKeycloakId(payload: string): Promise<Result<User>> {
    const user = (await this.dao.getByCriteria({ keycloakId: payload })) as User;
    if (!user) {
      return Result.notFound(`User with KCID ${payload} does not exist.`);
    }
    return Result.ok<User>(user);
  }
}
