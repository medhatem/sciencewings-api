import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Reservation } from '@/modules/reservation/models/Reservation';

@provideSingleton()
export class ResourceEventDao extends BaseDao<Reservation> {
  private constructor(public model: Reservation) {
    super(model);
  }

  static getInstance(): ResourceEventDao {
    return container.get(ResourceEventDao);
  }
}
