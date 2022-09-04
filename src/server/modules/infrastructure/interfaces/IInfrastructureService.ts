import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { InfrastructureRO, UpdateinfrastructureRO } from '@/modules/infrastructure/routes/RequestObject';
import { infrastructurelistline } from '@/types/types';
export abstract class IInfrastructureService extends IBaseService<any> {
  getAllOgranizationInfrastructures: (orgId: number) => Promise<Infrastructure[]>;
  createinfrastructure: (payload: InfrastructureRO) => Promise<number>;
  updateInfrastructure: (payload: UpdateinfrastructureRO, resourceId: number) => Promise<number>;
  getAllOrganizationInfrastructureList: (orgId: number) => Promise<infrastructurelistline[]>;
}
