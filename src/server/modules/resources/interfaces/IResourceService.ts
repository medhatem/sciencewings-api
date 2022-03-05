import { CreateResourceRO } from '@/modules/resources/routes/RequestObject';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Resource } from '@/modules/resources/models/Resource';
import { Result } from '@/utils/Result';

export abstract class IResourceService extends IBaseService<any> {
  getOgranizationResources: (organizationId: number) => Promise<Result<Resource[]>>;
  createResource: (payload: CreateResourceRO) => Promise<Result<number>>;
  updateResource: (payload: CreateResourceRO, resourceId: number) => Promise<Result<number>>;
}
