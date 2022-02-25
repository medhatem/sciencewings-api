import { container, provideSingleton } from '@/di/index';
import { BaseDao } from '../../base/daos/BaseDao';
import { Group } from '../models/Group';

@provideSingleton()
export class GroupDAO extends BaseDao<Group> {
  private constructor(public model: Group) {
    super(model);
  }

  static getInstance(): GroupDAO {
    return container.get(GroupDAO);
  }
}
