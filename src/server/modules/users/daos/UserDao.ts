import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { User } from '@/modules/users/models/User';

@provideSingleton()
export class UserDao extends BaseDao<User> {
  private constructor(public model: User = User.getInstance()) {
    super(model);
  }

  static getInstance(): UserDao {
    return container.get(UserDao);
  }
}
