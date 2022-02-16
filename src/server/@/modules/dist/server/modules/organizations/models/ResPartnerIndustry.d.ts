import { BaseModel } from '@/modules/base/models/BaseModel';
export declare class ResPartnerIndustry extends BaseModel<ResPartnerIndustry> {
    constructor();
    static getInstance(): ResPartnerIndustry;
    id: number;
    name?: string;
    fullName?: string;
    active?: boolean;
}
