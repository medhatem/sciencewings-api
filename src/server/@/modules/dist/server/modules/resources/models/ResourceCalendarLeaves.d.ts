import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
import { Resource } from './Resource';
import { ResourceCalendar } from './ResourceCalendar';
export declare class ResourceCalendarLeaves extends BaseModel<ResourceCalendarLeaves> {
    constructor();
    static getInstance(): ResourceCalendarLeaves;
    id: number;
    name?: string;
    organization?: Organization;
    calendar?: ResourceCalendar;
    dateFrom: Date;
    dateTo: Date;
    resource?: Resource;
    timeType?: string;
}
