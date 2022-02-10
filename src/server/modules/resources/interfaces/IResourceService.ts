import { Result } from '@utils/Result';
import { CreateResourceRO } from '../routes/RequestObject';

export abstract class IResourceService {
  createResource: (payload: CreateResourceRO) => Promise<Result<number>>;
}
