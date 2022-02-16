import { BaseModel } from '@/modules/base/models/BaseModel';
export declare class ResPartnerTitle extends BaseModel<ResPartnerTitle> {
    constructor();
    static getInstance(): ResPartnerTitle;
    id: number;
    name: string;
    shortcut?: string;
}
