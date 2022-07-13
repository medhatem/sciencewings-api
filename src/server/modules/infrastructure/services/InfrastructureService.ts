import { BaseService } from '@/modules/base/services/BaseService';
import { provideSingleton, container } from '@/di/index';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { infrastructureDAO } from '@/modules/infrastructure/daos/infrastructureDAO';
import { IInfrastructureService } from '@/modules/infrastructure/interfaces/IInfrastructureService';
@provideSingleton(IInfrastructureService)
export class InfrastructureService extends BaseService<Infrastructure> implements IInfrastructureService {
  constructor(public dao: infrastructureDAO) {
    super(dao);
  }

  static getInstance(): IInfrastructureService {
    return container.get(IInfrastructureService);
  }
}
