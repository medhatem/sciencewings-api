import { BaseService } from '@/modules/base/services/BaseService';
import { CreateResourceRO } from '../routes/RequestObject';
import { Resource } from '@/modules/resources/models/Resource';
import { ResourceDao } from '../daos/ResourceDao';
import { Result } from '@utils/Result';
import { IResourceCalendarService, IResourceService } from '../interfaces';
import { IUserService } from '@/modules/users/interfaces';
import { IOrganizationService } from '@/modules/organizations/interfaces';
export declare class ResourceService extends BaseService<Resource> {
    dao: ResourceDao;
    userService: IUserService;
    organisationService: IOrganizationService;
    resourceCalendarService: IResourceCalendarService;
    constructor(dao: ResourceDao, userService: IUserService, organisationService: IOrganizationService, resourceCalendarService: IResourceCalendarService);
    static getInstance(): IResourceService;
    createResource(payload: CreateResourceRO): Promise<Result<number>>;
    updateResource(payload: CreateResourceRO, resourceId: number): Promise<Result<number>>;
}
