import { container, inject, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Reservation } from '@/modules/reservation/models/Reservation';
import { LazyServiceIdentifer } from 'inversify/lib/annotation/lazy_service_identifier';

@provideSingleton()
export class ResourceEventDao extends BaseDao<Reservation> {
  private constructor(
    // public model: Reservation,
    @inject(new LazyServiceIdentifer(() => Reservation)) public model: Reservation,
  ) {
    super(model);
  }

  static getInstance(): ResourceEventDao {
    return container.get(ResourceEventDao);
  }
}
