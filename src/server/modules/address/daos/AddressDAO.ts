import { container, provideSingleton } from '@di/index';
import { BaseDao } from '../../base/daos/BaseDao';
import { Address } from '@modules/address/models/AdressModel';

@provideSingleton()
export class AddressDao extends BaseDao<Address> {
  private constructor(public model: Address) {
    super(model);
  }

  static getInstance(): AddressDao {
    return container.get(AddressDao);
  }
}
