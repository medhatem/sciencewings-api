import { container, provideSingleton } from '@di/index';

import { BaseDao } from '@modules/base/daos/BaseDao';
import { Contract } from '@modules/hr/models/Contract';

@provideSingleton()
export class ContractDao extends BaseDao<Contract> {
  private constructor(public model: Contract) {
    super(model);
  }

  static getInstance(): ContractDao {
    return container.get(ContractDao);
  }
}
