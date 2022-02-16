import { BaseModel } from '@/modules/base/models/BaseModel';
export declare class ResPartnerCategory extends BaseModel<ResPartnerCategory> {
    constructor();
    static getInstance(): ResPartnerCategory;
    id: number;
    name: string;
    parent?: ResPartnerCategory;
    active?: boolean;
    parentPath?: string;
}
