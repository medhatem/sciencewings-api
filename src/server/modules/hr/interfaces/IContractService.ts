import { CreateContractRO, UpdateContractRO } from '@/modules/hr/routes/RequestObject';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Contract } from '@/modules/hr/models/Contract';

export abstract class IContractService extends IBaseService<any> {
  getAllMemberContracts: (userId: number, orgId: number) => Promise<Contract[]>;
  createContract: (payload: CreateContractRO) => Promise<number>;
  updateContract: (payload: UpdateContractRO, id: number) => Promise<number>;
}
