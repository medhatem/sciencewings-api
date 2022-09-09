import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Reservation } from '@/modules/reservation/models/Reservation';

@provideSingleton()
export class ReservationDao extends BaseDao<Reservation> {
  private constructor(public model: Reservation) {
    super(model);
  }

  static getInstance(): ReservationDao {
    return container.get(ReservationDao);
  }
}
