import { container, provideSingleton } from '@di/index';

import { BaseService } from '@modules/base/services/BaseService';
import { Keycloak } from '@sdks/keycloak';
import { KeycloakUserInfo } from '../../../types/UserRequest';
import { User } from '@modules/users/models/User';
import { UserDao } from '../daos/UserDao';

@provideSingleton()
export class UserService extends BaseService<User> {
  constructor(public dao: UserDao, public keycloak: Keycloak = Keycloak.getInstance()) {
    super(dao);
  }

  static getInstance(): UserService {
    return container.get(UserService);
  }

  async registerUser(userInfo: KeycloakUserInfo): Promise<number> {
    // get the userKeyCloakId
    const users = await this.keycloak.getAdminClient().users.find({ email: userInfo.email, realm: 'sciencewings-web' });

    if (!users || !users.length) {
      throw new Error('No user found!');
    }
    const user = this.dao.model;
    user.firstname = userInfo.given_name;
    user.lastname = userInfo.family_name;
    user.email = userInfo.email;
    user.keycloakId = users[0].id;
    const createdUser = await this.dao.create(user);
    return createdUser.id;
  }

  /**
   * fetches a user based on some search criteria
   *
   * @param criteria the search criteria
   */
  async getUserByCriteria(criteria: { [key: string]: any }) {
    return await this.dao.getByCriteria(criteria);
  }
}
