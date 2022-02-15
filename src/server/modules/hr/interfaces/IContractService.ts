import { ContractRO } from '../routes/RequestObject';
import { IBaseService } from '../../base/interfaces/IBaseService';
import { Result } from './../../../utils/Result';

export abstract class IContractService extends IBaseService<any> {
  createContract: (payload: ContractRO) => Promise<Result<number>>;
  updateContract: (payload: ContractRO, id: number) => Promise<Result<number>>;
}
