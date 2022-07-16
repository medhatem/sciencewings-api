import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@/utils/Result';
import { UpdateinfrastructureRO } from '../routes/RequestObject';
export abstract class IInfrastructureService extends IBaseService<any> {
  updateinfrastructure: (payload: UpdateinfrastructureRO, resourceId: number) => Promise<Result<number>>;
}
