import { BaseModel } from '@/modules/base/models/BaseModel';
import { ResCountry } from '@/modules/organizations/models/ResCountry';
import { ResCountryState } from '@/modules/organizations/models/ResCountryState';
export declare class ResBank extends BaseModel<ResBank> {
    constructor();
    static getInstance(): ResBank;
    id: number;
    name: string;
    street?: string;
    street2?: string;
    zip?: string;
    city?: string;
    state?: ResCountryState;
    country?: ResCountry;
    email?: string;
    phone?: string;
    active?: boolean;
    bic?: string;
}
