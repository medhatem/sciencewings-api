import { BaseModel } from '@/modules/base/models/BaseModel';
import { ResCountry } from '@/modules/organizations/models/ResCountry';
import { ResourceCalendar } from '@/modules/resources/models/ResourceCalendar';
export declare class PayrollStructureType extends BaseModel<PayrollStructureType> {
    constructor();
    static getInstance(): PayrollStructureType;
    id: number;
    name?: string;
    defaultResourceCalendar?: ResourceCalendar;
    country?: ResCountry;
}
