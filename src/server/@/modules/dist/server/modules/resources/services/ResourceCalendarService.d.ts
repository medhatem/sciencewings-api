import { BaseService } from '@/modules/base/services/BaseService';
import { CreateResourceCalendarRO } from '../routes/RequestObject';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { Result } from '@utils/Result';
import { ResourceCalendar } from '../models/ResourceCalendar';
import { ResourceCalendarDao } from '../daos/ResourceCalendarDAO';
import { IResourceCalendarService } from '../interfaces';
export declare class ResourceCalendarService extends BaseService<ResourceCalendar> {
    dao: ResourceCalendarDao;
    organisationService: IOrganizationService;
    constructor(dao: ResourceCalendarDao, organisationService: IOrganizationService);
    static getInstance(): IResourceCalendarService;
    createResourceCalendar(payload: CreateResourceCalendarRO): Promise<Result<ResourceCalendar>>;
}
