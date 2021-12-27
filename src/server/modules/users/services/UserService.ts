import { container, provideSingleton } from '@di/index';

import { BaseService } from '@modules/base/services/BaseService';
import { Keycloak } from '@sdks/keycloak';
import { KeycloakUserInfo } from '../../../types/UserRequest';
import { User } from '@modules/users/models/User';
import { UserDao } from '../daos/UserDao';

@provideSingleton()
export class UserService extends BaseService<User> {
  constructor(public dao: UserDao) {
    super(dao);
  }

  static getInstance(): UserService {
    return container.get(UserService);
  }

  async registerUser(userInfo: KeycloakUserInfo): Promise<number> {
    // get the userKeyCloakId
    const users = await Keycloak.getInstance()
      .getAdminClient()
      .users.find({ email: userInfo.email, realm: 'sciencewings-web' });

    if (!users || !users.length) {
      throw new Error('No user found!');
    }
    const user = User.getInstance();
    user.firstname = userInfo.given_name;
    user.lastname = userInfo.family_name;
    user.email = userInfo.email;
    user.keycloakId = users[0].id;
    return await this.dao.create(user);
  }
}
