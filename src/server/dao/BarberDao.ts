import { container, provideSingleton } from '@di/index';

import { Barber } from '@models/Barber';
import { BaseDao } from './BaseDao';

@provideSingleton()
export class BarberDao extends BaseDao<Barber> {
  private constructor(public model: Barber) {
    super(model);
  }

  static getInstance(): BarberDao {
    return container.get(BarberDao);
  }
}
