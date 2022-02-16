import { ContractService } from '../services/ContractService';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Contract } from '../models/Contract';
export declare class ContractRoutes extends BaseRoutes<Contract> {
    private ContractRoutes;
    constructor(ContractRoutes: ContractService);
    static getInstance(): ContractRoutes;
    newRoute(body: string): Promise<string>;
}
