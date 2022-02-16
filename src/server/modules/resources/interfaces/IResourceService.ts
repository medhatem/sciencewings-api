import { CreateResourceRO } from '../routes/RequestObject';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@utils/Result';

export abstract class IResourceService extends IBaseService<any> {
  createResource: (payload: CreateResourceRO) => Promise<Result<number>>;
  updateResource: (payload: CreateResourceRO, resourceId: number) => Promise<Result<number>>;
}
