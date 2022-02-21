import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '../../base/daos/BaseDao';
import { Contract } from '../../hr/models/Contract';

@provideSingleton()
export class ContractDao extends BaseDao<Contract> {
  private constructor(public model: Contract) {
    super(model);
  }

  static getInstance(): ContractDao {
    return container.get(ContractDao);
  }
}
