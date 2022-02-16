import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Contract } from '@/modules/hr/models/Contract';
export declare class ContractDao extends BaseDao<Contract> {
    model: Contract;
    private constructor();
    static getInstance(): ContractDao;
}
