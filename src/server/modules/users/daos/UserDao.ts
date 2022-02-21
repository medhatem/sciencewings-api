import { container, provideSingleton } from '../../../di';

import { BaseDao } from '../../base/daos/BaseDao';
import { User } from '../../users/models/User';

@provideSingleton()
export class UserDao extends BaseDao<User> {
  private constructor(public model: User) {
    super(model);
  }

  static getInstance(): UserDao {
    return container.get(UserDao);
  }
}
