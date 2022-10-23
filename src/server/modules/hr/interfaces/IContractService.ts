import { CreateContractRO, UpdateContractRO } from '@/modules/hr/routes/RequestObject';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';

export abstract class IContractService extends IBaseService<any> {
  getAllMemberContracts: (orgId: number, userId: number, page?: number, limit?: number) => Promise<any>;
  createContract: (payload: CreateContractRO) => Promise<number>;
  updateContract: (payload: UpdateContractRO, id: number) => Promise<number>;
}
