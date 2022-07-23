import { ContractRO } from '@/modules/hr/routes/RequestObject';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';

export abstract class IContractService extends IBaseService<any> {
  createContract: (payload: ContractRO) => Promise<number>;
  updateContract: (payload: ContractRO, id: number) => Promise<number>;
}
