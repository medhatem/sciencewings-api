import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from './Organization';
import { ResBank } from './ResBank';
import { ResCurrency } from './ResCurrency';
import { ResPartner } from './ResPartner';
export declare class ResPartnerBank extends BaseModel<ResPartnerBank> {
    constructor();
    static getInstance(): ResPartnerBank;
    id: number;
    active?: boolean;
    accNumber: string;
    sanitizedAccNumber?: string;
    accHolderName?: string;
    partner: ResPartner;
    bank?: ResBank;
    sequence?: number;
    currency?: ResCurrency;
    organization?: Organization;
}
