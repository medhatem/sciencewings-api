import { CreateContractRO } from '@/modules/hr/routes/RequestObject';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';

export abstract class IContractService extends IBaseService<any> {
  createContract: (payload: CreateContractRO) => Promise<number>;
  updateContract: (payload: CreateContractRO, id: number) => Promise<number>;
}
