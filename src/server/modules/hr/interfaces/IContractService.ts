import { CreateContractRO, UpdateContractRO } from '@/modules/hr/routes/RequestObject';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { ContractsList } from '@/types/types';

export abstract class IContractService extends IBaseService<any> {
  getAllMemberContracts: (orgId: number, userId: number, page?: number, size?: number) => Promise<ContractsList>;
  createContract: (payload: CreateContractRO) => Promise<number>;
  updateContract: (payload: UpdateContractRO, id: number) => Promise<number>;
}
