import { BaseModel } from '@/modules/base/models/BaseModel';
export declare class ResCurrency extends BaseModel<ResCurrency> {
    constructor();
    static getInstance(): ResCurrency;
    id: number;
    name: string;
    symbol: string;
    fullName?: string;
    rounding?: number;
    decimalPlaces?: number;
    active?: boolean;
    position?: string;
    currencyUnitLabel?: string;
    currencySubunitLabel?: string;
}
