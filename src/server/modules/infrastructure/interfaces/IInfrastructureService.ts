import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { InfrastructureRO, UpdateinfrastructureRO } from '@/modules/infrastructure/routes/RequestObject';
import { infrastructurelistline } from '@/modules/infrastructure/infastructureTypes';
export abstract class IInfrastructureService extends IBaseService<any> {
  getAllOgranizationInfrastructures: (orgId: number) => Promise<Infrastructure[]>;
  createinfrastructure: (payload: InfrastructureRO) => Promise<number>;
  getInfrastructureById: (infraId: number) => Promise<Infrastructure>;
  updateInfrastructure: (payload: UpdateinfrastructureRO, resourceId: number) => Promise<number>;
  getAllInfrastructuresOfAgivenOrganization: (orgId: number) => Promise<infrastructurelistline[]>;
  deleteResourceFromGivenInfrastructure: (resourceId: number, infrastructureId: number) => Promise<number>;
  addResourceToInfrastructure: (resourceId: number, infrastructureId: number) => Promise<number>;
}
