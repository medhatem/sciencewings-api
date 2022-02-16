import { BaseDao } from '@/modules/base/daos/BaseDao';
import { ResourceCalendar } from './../models/ResourceCalendar';
export declare class ResourceCalendarDao extends BaseDao<ResourceCalendar> {
    model: ResourceCalendar;
    private constructor();
    static getInstance(): ResourceCalendarDao;
}
