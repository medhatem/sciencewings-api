import { container, provideSingleton } from '@di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Phone } from '@/modules/phones/models/Phone';

@provideSingleton()
export class PhoneDao extends BaseDao<Phone> {
  private constructor(public model: Phone) {
    super(model);
  }

  static getInstance(): PhoneDao {
    return container.get(PhoneDao);
  }
}
