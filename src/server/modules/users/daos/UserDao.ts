import { container, provideSingleton } from '@di/index';

import { BaseDao } from '../../base/daos/BaseDao';
import { User } from '@modules/users/models/User';

@provideSingleton()
export class UserDao extends BaseDao<User> {
  private constructor(public model: User) {
    super(model);
  }

  static getInstance(): UserDao {
    return container.get(UserDao);
  }
}
