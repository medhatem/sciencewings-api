import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { InfrastructureRO, UpdateinfrastructureRO } from '../routes/RequestObject';
export abstract class IInfrastructureService extends IBaseService<any> {
  getAllOgranizationInfrastructures: (orgId: number) => Promise<Infrastructure[]>;
  getOrganizationInfrastructureByOrgId: (infId: number) => Promise<Infrastructure>;
  createinfrastructure: (payload: InfrastructureRO) => Promise<number>;
  updateInfrastructure: (payload: UpdateinfrastructureRO, resourceId: number) => Promise<number>;
}
