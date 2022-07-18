import { container, provideSingleton } from '@/di/index';
import { Path } from 'typescript-rest';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { IInfrastructureService } from '@/modules/infrastructure/interfaces/IInfrastructureService';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { CreateInfrustructureDTO, infrastructureGetDTO } from '@/modules/infrastructure/dtos/InfrustructureDTO';

@provideSingleton()
@Path('infrastructure')
export class InfrastructureRoutes extends BaseRoutes<Infrastructure> {
  constructor(InfrastructureService: IInfrastructureService) {
    super(InfrastructureService as any, new CreateInfrustructureDTO(), new infrastructureGetDTO());
  }

  static getInstance(): InfrastructureRoutes {
    return container.get(InfrastructureRoutes);
  }
}
