import { BaseService } from '@/modules/base/services/BaseService';
import { Contract } from '@/modules/hr/models/Contract';
import { ContractDao } from '../daos/ContractDao';
import { IContractService } from '../interfaces/IContractService';
export declare class ContractService extends BaseService<Contract> implements IContractService {
    dao: ContractDao;
    constructor(dao: ContractDao);
    static getInstance(): IContractService;
}
