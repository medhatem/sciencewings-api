import { BaseModel } from '@/modules/base/models/BaseModel';
import { ResCountry } from '@/modules/organizations/models/ResCountry';
export declare class ResCountryState extends BaseModel<ResCountryState> {
    constructor();
    static getInstance(): ResCountryState;
    id: number;
    country: ResCountry;
    name: string;
    code: string;
}
