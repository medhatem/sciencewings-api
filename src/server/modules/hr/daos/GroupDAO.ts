import { container, provideSingleton } from '@/di/index';
import { BaseDao } from '../../base/daos/BaseDao';
import { Group } from '..';

@provideSingleton()
export class GroupDAO extends BaseDao<Group> {
  private constructor(public model: Group) {
    super(model);
  }

  static getInstance(): GroupDAO {
    return container.get(GroupDAO);
  }
}
