import { container, provideSingleton } from '@di/index';

import { BaseService } from '@modules/base/services/BaseService';
import { Contract } from '@modules/hr/models/Contract';
import { ContractDao } from '../daos/ContractDao';

@provideSingleton()
export class ContractService extends BaseService<Contract> {
  constructor(public dao: ContractDao) {
    super(dao);
  }

  static getInstance(): ContractService {
    return container.get(ContractService);
  }
}
