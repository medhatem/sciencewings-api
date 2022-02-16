import { BaseModel } from '@/modules/base/models/BaseModel';
export declare class ResGroups extends BaseModel<ResGroups> {
    constructor();
    static getInstance(): ResGroups;
    id: number;
    name: string;
    comment?: string;
    categoryId?: number;
    share?: boolean;
}
