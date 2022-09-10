import { container, provideSingleton } from '@/di/index';

import { Address } from '@/modules/address/models/Address';
import { BaseDao } from '@/modules/base/daos/BaseDao';

@provideSingleton()
export class AddressDao extends BaseDao<Address> {
  private constructor(public model: Address) {
    super(model);
  }

  static getInstance(): AddressDao {
    return container.get(AddressDao);
  }
}
