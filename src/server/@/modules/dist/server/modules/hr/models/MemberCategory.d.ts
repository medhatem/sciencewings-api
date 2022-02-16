import { BaseModel } from '@/modules/base/models/BaseModel';
export declare class MemberCategory extends BaseModel<MemberCategory> {
    constructor();
    static getInstance(): MemberCategory;
    id: number;
    name: string;
}
