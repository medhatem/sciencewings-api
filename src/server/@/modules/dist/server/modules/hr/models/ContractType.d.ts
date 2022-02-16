import { BaseModel } from '@/modules/base/models/BaseModel';
export declare class ContractType extends BaseModel<ContractType> {
    constructor();
    static getInstance(): ContractType;
    id: number;
    name: string;
}
