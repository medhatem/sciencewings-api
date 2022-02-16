import { BaseModel } from '@/modules/base/models/BaseModel';
export declare class ResCountryGroup extends BaseModel<ResCountryGroup> {
    constructor();
    static getInstance(): ResCountryGroup;
    id: number;
    name: string;
}
