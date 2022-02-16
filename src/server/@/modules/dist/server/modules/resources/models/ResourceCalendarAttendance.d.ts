import { BaseModel } from '@/modules/base/models/BaseModel';
import { Resource } from './Resource';
import { ResourceCalendar } from './ResourceCalendar';
export declare class ResourceCalendarAttendance extends BaseModel<ResourceCalendarAttendance> {
    constructor();
    static getInstance(): ResourceCalendarAttendance;
    id: number;
    name: string;
    dayofweek: string;
    dateFrom?: Date;
    dateTo?: Date;
    hourFrom: number;
    hourTo: number;
    calendar: ResourceCalendar;
    dayPeriod: string;
    resource?: Resource;
    weekType?: string;
    displayType?: string;
    sequence?: number;
}
