import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@/utils/Result';
import { InfrastructureRO, UpdateinfrastructureRO } from '../routes/RequestObject';
export abstract class IInfrastructureService extends IBaseService<any> {
  createInfrustructure: (payload: InfrastructureRO) => Promise<Result<number>>;
  updateInfrastructure: (payload: UpdateinfrastructureRO, resourceId: number) => Promise<Result<number>>;
}
