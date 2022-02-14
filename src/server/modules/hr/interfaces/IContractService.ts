import { Result } from './../../../utils/Result';
import { IBaseService } from '../../base/interfaces/IBaseService';
import { ContractRO } from '../routes/RequestObject';

export abstract class IContractService extends IBaseService<any> {
  createContract: (payload: ContractRO) => Promise<Result<number>>;
  updateContract: (payload: ContractRO, id: number) => Promise<Result<number>>;
}
