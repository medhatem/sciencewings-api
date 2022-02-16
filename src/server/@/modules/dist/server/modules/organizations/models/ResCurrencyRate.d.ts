import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from './Organization';
import { ResCurrency } from '@/modules/organizations/models/ResCurrency';
export declare class ResCurrencyRate extends BaseModel<ResCurrencyRate> {
    constructor();
    static getInstance(): ResCurrencyRate;
    id: number;
    name: Date;
    rate?: number;
    currency: ResCurrency;
    organization?: Organization;
}
