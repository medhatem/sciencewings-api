import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { InfrastructureRO, UpdateinfrastructureRO } from '@/modules/infrastructure/routes/RequestObject';
import { subInfrasListLine } from '@/modules/infrastructure/infastructureTypes';
import { Resource } from '@/modules/resources/models/Resource';
import { InfrastructuresList } from '@/types/types';
export abstract class IInfrastructureService extends IBaseService<any> {
  getAllOrganizationInfrastructures: (orgId: number, page?: number, size?: number) => Promise<InfrastructuresList>;
  createinfrastructure: (payload: InfrastructureRO) => Promise<number>;
  getInfrastructureById: (infraId: number) => Promise<Infrastructure>;
  updateInfrastructure: (payload: UpdateinfrastructureRO, resourceId: number) => Promise<number>;
  getAllInfrastructuresOfAgivenOrganization: (
    orgId: number,
    page?: number,
    size?: number,
    query?: string,
  ) => Promise<any>;
  deleteResourceFromGivenInfrastructure: (resourceId: number, infrastructureId: number) => Promise<number>;
  addResourceToInfrastructure: (resourceId: number, infrastructureId: number) => Promise<number>;
  getAllResourcesOfAGivenInfrastructure: (infrastructureId: number) => Promise<Resource[]>;
  getAllSubInfasOfAGivenInfrastructure: (infrastructureId: number) => Promise<subInfrasListLine[]>;
}
