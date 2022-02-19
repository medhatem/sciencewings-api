import { container, provideSingleton } from '@/di/index';
import { BaseDao } from '../../base/daos/BaseDao';
import { Phone } from '../../phones/models/Phone';

@provideSingleton()
export class PhoneDao extends BaseDao<Phone> {
  private constructor(public model: Phone) {
    super(model);
  }

  static getInstance(): PhoneDao {
    return container.get(PhoneDao);
  }
}
