import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { InfrastructureRO, UpdateinfrastructureRO } from '../routes/RequestObject';
export abstract class IInfrastructureService extends IBaseService<any> {
  createInfrustructure: (payload: InfrastructureRO) => Promise<number>;
  updateInfrastructure: (payload: UpdateinfrastructureRO, resourceId: number) => Promise<number>;
}
