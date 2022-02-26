import { container, provideSingleton } from '@/di/index';
<<<<<<< HEAD

import { Address } from '@/modules/address/models/AdressModel';
import { BaseDao } from '@/modules/base/daos/BaseDao';
=======
import { BaseDao } from '../../base/daos/BaseDao';
import { Address } from '../../address/models/AdressModel';
>>>>>>> ba72b891634546c3eca15350beaa5fafdcaa8354

@provideSingleton()
export class AddressDao extends BaseDao<Address> {
  private constructor(public model: Address) {
    super(model);
  }

  static getInstance(): AddressDao {
    return container.get(AddressDao);
  }
}
