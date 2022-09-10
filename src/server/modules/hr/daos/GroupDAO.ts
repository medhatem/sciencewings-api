import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Group } from '@/modules/hr/models/Group';

@provideSingleton()
export class GroupDAO extends BaseDao<Group> {
  private constructor(public model: Group) {
    super(model);
  }

  static getInstance(): GroupDAO {
    return container.get(GroupDAO);
  }
}
