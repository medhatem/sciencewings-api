import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
import { ResourceCalendar } from './ResourceCalendar';
import { User } from '@/modules/users/models/User';
export declare class Resource extends BaseModel<Resource> {
    constructor();
    static getInstance(): Resource;
    id: number;
    name: string;
    active?: boolean;
    organization?: Organization;
    resourceType: string;
    user?: User;
    timeEfficiency: number;
    calendar: ResourceCalendar;
    timezone: string;
}
