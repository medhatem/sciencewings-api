import { Phone } from '@/modules/phones/models/Phone';
import { wrap } from '@mikro-orm/core';
import { ResetPasswordRO } from '@/modules/users/routes/RequstObjects';
import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { Email } from '@/utils/Email';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { Keycloak } from '@/sdks/keycloak';
import { KeycloakUserInfo } from '@/types/UserRequest';
import { Result } from '@/utils/Result';
import { User } from '@/modules/users/models/User';
import { UserDao } from '@/modules/users/daos/UserDao';
import { UserRO } from '@/modules/users/routes/RequstObjects';
import { getConfig } from '@/configuration/Configuration';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';
import { validateParam } from '@/decorators/validateParam';
import { CreateUserSchema, UpdateUserSchema } from '@/modules/users/schemas/UserSchema';
import { validate } from '@/decorators/validate';
import { Address } from '@/modules/address';
@provideSingleton(IUserService)
export class UserService extends BaseService<User> implements IUserService {
  constructor(
    public dao: UserDao,
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
    // const { phones } = payload;
    // delete payload.phones;

    const userDetail = this.wrapEntity(this.dao.model, {
      email: payload.email,
      firstname: payload.firstname,
      lastname: payload.lastname,
      address: payload.address,
      phones: payload.phones,
      dateofbirth: payload.dateofbirth,
      signature: payload.signature,
      actionId: payload.actionId,
      share: payload.share,
    });
    const authedUser = await this.dao.get(userId);
    if (!authedUser) {
      return Result.fail<number>(`User with id ${userId} does not exist`);
    }

    const user: User = {
      ...authedUser,
      ...userDetail,
    };

    // await Promise.all(
    //   phones.map(async (p: any) => {
    //     await this.phoneService.createBulkPhoneForUser([p], user);
    //   }),
    // );

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
      //TODO send email
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
    try {
      const user = await this.dao.getByCriteria(criteria);
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
  @validate
  async createUser(@validateParam(CreateUserSchema) user: UserRO): Promise<Result<User>> {
    try {
      const userAddress = user.address;
      const userPhones = user.phones;

      // removing unmanaged entities
      delete user.address;
      delete user.phones;

      const createdUser = await this.dao.create(
        this.wrapEntity(new User(), {
          ...user,
        }),
      );

      createdUser.address = await createdUser.address.init();
      createdUser.phone = await createdUser.phone.init();

      userAddress.map((address) => {
        const wrappedAddress = wrap(new Address()).assign({
          city: address.city,
          apartment: address.apartment,
          country: address.country,
          code: address.code,
          province: address.province,
          street: address.street,
          type: address.type,
        });
        wrappedAddress.user = createdUser;
        createdUser.address.add(wrappedAddress);
      });
      userPhones.map((phone) => {
        const wrappedPhone = wrap(new Phone()).assign({
          label: phone.label,
          code: phone.code,
          number: phone.number,
        });
        wrappedPhone.user = createdUser;
        createdUser.phone.add(wrappedPhone);
      });

      this.dao.repository.flush();

      const fetchdUser: User = await this.dao.get(createdUser.id);
      return Result.ok<User>(fetchdUser);
    } catch (error) {
      return Result.fail(error);
    }
  }

  @log()
  @safeGuard()
  @validate
  async updateUser(@validateParam(UpdateUserSchema) user: UserRO, keycloakId: string): Promise<Result<User>> {
    const fetchedUser = await this.dao.getByCriteria({ keycloakId });

    if (!fetchedUser) {
      return Result.fail(`User with KCID ${keycloakId} does not exist.`);
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
    const user = await this.dao.getByCriteria({ keycloakId: payload });
    if (!user) {
      return Result.fail(`User with KCID ${payload} does not exist.`);
    }
    return Result.ok<User>(user);
  }
}
