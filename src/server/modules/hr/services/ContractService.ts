import { container, provideSingleton } from '@di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { Contract } from '@/modules/hr/models/Contract';
import { ContractDao } from '../daos/ContractDao';
import { IContractService } from '../interfaces/IContractService';

@provideSingleton(IContractService)
export class ContractService extends BaseService<Contract> implements IContractService {
  constructor(public dao: ContractDao) {
    super(dao);
  }

  static getInstance(): IContractService {
    return container.get(IContractService);
  }
}
