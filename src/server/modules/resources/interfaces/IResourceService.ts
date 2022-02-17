import { IBaseService } from '../../base/interfaces/IBaseService';
import { Result } from '@utils/Result';
import { CreateResourceRO } from '../routes/RequestObject';

export abstract class IResourceService extends IBaseService<any> {
  createResource: (payload: CreateResourceRO) => Promise<Result<number>>;
  updateResource: (payload: CreateResourceRO, resourceId: number) => Promise<Result<number>>;
}
