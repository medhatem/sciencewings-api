import { container, provideSingleton } from '@/di/index';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';

import { BaseDao } from '@/modules/base/daos/BaseDao';

@provideSingleton()
export class infrastructureDAO extends BaseDao<Infrastructure> {
  private constructor(public model: Infrastructure) {
    super(model);
  }

  static getInstance(): infrastructureDAO {
    return container.get(infrastructureDAO);
  }
}
