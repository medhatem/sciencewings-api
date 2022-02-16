import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
export declare class ResourceCalendar extends BaseModel<ResourceCalendar> {
    constructor();
    static getInstance(): ResourceCalendar;
    id: number;
    name: string;
    active?: boolean;
    organization?: Organization;
    hoursPerDay?: number;
    timezone: string;
    twoWeeksCalendar?: boolean;
}
