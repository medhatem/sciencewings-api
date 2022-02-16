import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Resource } from '../models/Resource';
import { CreateResourceRO } from './RequestObject';
import { IResourceService } from '../interfaces';
import { CreateResourceDTO } from '@/modules/resources/dtos/CreatedResourceDTO';
export declare class ResourceRoutes extends BaseRoutes<Resource> {
    private ResourceService;
    constructor(ResourceService: IResourceService);
    static getInstance(): ResourceRoutes;
    /**
     * Registers a new resource in the database
     *
     * @param payload
     * Should container Resource data that include Resource data
     */
    createResource(payload: CreateResourceRO): Promise<CreateResourceDTO>;
    updateResource(payload: CreateResourceRO, id: number): Promise<CreateResourceDTO>;
}
