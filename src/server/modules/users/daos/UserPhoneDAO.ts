import { container, provideSingleton } from '@di/index';
import { BaseDao } from '../../base/daos/BaseDao';
import { UserPhone } from '../models/UserPhone';

@provideSingleton()
export class UserPhoneDao extends BaseDao<UserPhone> {
  private constructor(public model: UserPhone) {
    super(model);
  }

  static getInstance(): UserPhoneDao {
    return container.get(UserPhoneDao);
  }
}
