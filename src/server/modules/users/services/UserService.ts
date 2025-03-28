import { IAddressService } from '@/modules/address/interfaces/IAddressService';
import { IPhoneService } from '@/modules/phones/interfaces/IPhoneService';
import { applyToAll } from '@/utils/utilities';
import { ResetPasswordRO } from '@/modules/users/routes/RequstObjects';
import { container, lazyInject, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { Email } from '@/utils/Email';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { Keycloak } from '@/sdks/keycloak';
import { KeycloakUserInfo } from '@/types/UserRequest';
import { User, userStatus } from '@/modules/users/models/User';
import { UserDao } from '@/modules/users/daos/UserDao';
import { UserRO } from '@/modules/users/routes/RequstObjects';
import { log } from '@/decorators/log';
import { validateParam } from '@/decorators/validateParam';
import { CreateUserSchema, UpdateUserSchema } from '@/modules/users/schemas/UserSchema';
import { validate } from '@/decorators/validate';
import { KeycloakUtil } from '@/sdks/keycloak/KeycloakUtils';
import { NotFoundError, ValidationError } from '@/Exceptions';
import { ConflictError } from '@/Exceptions/ConflictError';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';

@provideSingleton(IUserService)
export class UserService extends BaseService<User> implements IUserService {
  @lazyInject(IMemberService) public memberService: IMemberService;

  constructor(
    public dao: UserDao,
    public addressService: IAddressService,
    public phoneService: IPhoneService,
    public keycloak: Keycloak,
    public emailService: Email,
    public keycloakUtils: KeycloakUtil,
  ) {
    super(dao);
  }

  static getInstance(): IUserService {
    return container.get(IUserService);
  }

  @log()
  async updateUserDetails(payload: UserRO, userId: number): Promise<number> {
    const user = await this.dao.get(userId);
    if (!user) {
      throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', { variables: { user: `${userId}` }, friendly: false });
    }

    if (payload.firstname !== user.firstname || payload.lastname !== user.lastname) {
      const members = await this.memberService.getByCriteria({ user }, FETCH_STRATEGY.ALL);

      applyToAll(members, async (member) => {
        await this.memberService.update(
          this.memberService.wrapEntity(member, {
            name: payload.firstname + ' ' + payload.lastname,
          }),
        );
      });
    }

    const userDetail = this.wrapEntity(user, {
      email: payload.email || user.email,
      firstname: payload.firstname || user.firstname,
      lastname: payload.lastname || user.lastname,
      dateofbirth: payload.dateofbirth || user.dateofbirth,
      signature: payload.signature || user.signature,
      actionId: payload.actionId || user.actionId,
      share: payload.share || user.share,
    });

    const updatedAddress = await this.addressService.get(payload.address.id);
    await this.addressService.update(
      this.wrapEntity(updatedAddress, {
        ...payload.address,
      }),
    );

    await payload.phones.map(async (phone) => {
      const updatedPhone = await this.phoneService.get(phone.id);
      await this.phoneService.update(
        this.wrapEntity(updatedPhone, {
          ...phone,
        }),
      );
    });

    const keycloakUserDetail: UserRepresentation = {
      firstName: payload.firstname || user.firstname,
      lastName: payload.lastname || user.lastname,
      email: payload.email || user.email,
      emailVerified: true,
    };

    await this.keycloakUtils.updateKcUser(user.keycloakId, keycloakUserDetail);

    await this.dao.update(userDetail);

    return userId;
  }

  @log()
  async registerUser(userInfo: KeycloakUserInfo): Promise<number> {
    // get the userKeyCloakId
    const users = await this.keycloakUtils.getUsersByEmail(userInfo.email);

    if (!users || !users.length) {
      throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', {
        variables: { user: `${userInfo.email}` },
        friendly: true,
      });
    }
    const user = new User();
    user.firstname = userInfo.given_name;
    user.lastname = userInfo.family_name;
    user.email = userInfo.email;
    user.keycloakId = users[0].id;
    let createdUser: { [key: string]: any } = { id: null };
    createdUser = await this.dao.create(user);
    return createdUser.id;
  }

  /**
   * fetches a user based on some search criteria
   *
   * @param criteria the search criteria
   */
  @log()
  async getUserByCriteria(criteria: { [key: string]: any }): Promise<User> {
    return (await this.dao.getByCriteria(criteria)) as User;
  }

  /**
   * reset a user password
   *
   * @param payload
   */
  @log()
  async resetPassword(payload: ResetPasswordRO): Promise<string> {
    if (payload.password !== payload.passwordConfirmation) {
      throw new ValidationError('VALIDATION.NON_MATCHING_PASSWORD', { friendly: true });
    }
    const user = (await this.dao.getByCriteria({ email: payload.email })) as User;

    if (!user) {
      throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', {
        variables: { user: `${payload.email}` },
        friendly: true,
      });
    }

    await this.keycloakUtils.resetPassword(user.keycloakId, payload.password);
    user.status = userStatus.ACTIVE;
    return 'Password reset successful';
  }

  @log()
  @validate
  async createUser(@validateParam(CreateUserSchema) user: UserRO): Promise<User> {
    const userExistingCheck: User = (await this.dao.getByCriteria({
      $or: [{ email: user.email }, { keycloakId: user.keycloakId }],
    })) as User;
    if (userExistingCheck) {
      throw new ConflictError('{{name}} ALREADY_EXISTS', { variables: { name: 'user' }, friendly: true });
    }
    const userPhones = user.phones;

    const address = await this.addressService.create({
      city: user.address.city,
      apartment: user.address.apartment,
      country: user.address.country,
      code: user.address.code,
      province: user.address.province,
      street: user.address.street,
      type: user.address.type,
    });

    const createdUser = await this.dao.create({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      dateofbirth: user.dateofbirth,
      keycloakId: user.keycloakId,
      address,
    });

    createdUser.phones = await createdUser.phones.init();

    await applyToAll(userPhones, async (phone) => {
      await this.phoneService.create({
        phoneLabel: phone.phoneLabel,
        phoneCode: phone.phoneCode,
        phoneNumber: phone.phoneNumber,
        user: createdUser,
      });
    });

    this.dao.repository.flush();
    return await this.dao.get(createdUser.id);
  }

  @log()
  @validate
  async updateUserByKeycloakId(@validateParam(UpdateUserSchema) user: UserRO, keycloakId: string): Promise<User> {
    const fetchedUser = (await this.dao.getByCriteria({ keycloakId })) as User;

    if (!fetchedUser) {
      throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', { variables: { user: `${keycloakId}` } });
    }
    return await this.dao.update(
      this.wrapEntity(fetchedUser, {
        ...fetchedUser,
        ...user,
      }),
    );
  }

  @log()
  async getUserByKeycloakId(payload: string): Promise<User> {
    const user = (await this.dao.getByCriteria({ keycloakId: payload })) as User;
    if (!user) {
      throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', { variables: { user: `${payload}` } });
    }
    user.phones.init();

    return user;
  }

  @log()
  async changeUserLanguage(language: string, userId: number): Promise<number> {
    const user = await this.dao.get(userId);
    if (!user) {
      throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', { variables: { user: `${userId}` } });
    }

    await this.keycloakUtils.updateKcUser(user.keycloakId, { attributes: { locale: language } });

    return user.id;
  }
}
