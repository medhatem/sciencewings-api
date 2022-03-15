import { ResourceRO } from '@/modules/resources/routes/RequestObject';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Resource } from '@/modules/resources/models/Resource';
import { Result } from '@/utils/Result';

export abstract class IResourceService extends IBaseService<any> {
  getResourcesOfAGivenOrganizationById: (organizationId: number) => Promise<Result<Resource[]>>;
  createResource: (payload: ResourceRO) => Promise<Result<number>>;
  updateResource: (payload: ResourceRO, resourceId: number) => Promise<Result<number>>;
}
