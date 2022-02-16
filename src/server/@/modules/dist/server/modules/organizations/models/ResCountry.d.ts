import { BaseModel } from '@/modules/base/models/BaseModel';
import { ResCurrency } from '@/modules/organizations/models/ResCurrency';
export declare class ResCountry extends BaseModel<ResCountry> {
    constructor();
    static getInstance(): ResCountry;
    id: number;
    name: string;
    code?: string;
    addressFormat?: string;
    addressViewId?: number;
    currency?: ResCurrency;
    phoneCode?: number;
    namePosition?: string;
    vatLabel?: string;
    stateRequired?: boolean;
    zipRequired?: boolean;
}
