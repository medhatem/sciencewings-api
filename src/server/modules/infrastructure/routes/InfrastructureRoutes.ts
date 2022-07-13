import { container, provideSingleton } from '@/di/index';
import { Path } from 'typescript-rest';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { IInfrastructureService } from '@/modules/infrastructure/interfaces/IInfrastructureService';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { CreateInfrustructureDTO, UpdateInfrustructureDTO } from '@/modules/infrastructure/dtos/InfrustructureDTO';

@provideSingleton()
@Path('infrustructur')
export class InfrastructureRoutes extends BaseRoutes<Infrastructure> {
  constructor(InfrastructureService: IInfrastructureService) {
    super(InfrastructureService as any, new CreateInfrustructureDTO(), new UpdateInfrustructureDTO());
  }

  static getInstance(): InfrastructureRoutes {
    return container.get(InfrastructureRoutes);
  }
}
