import { BaseService } from '@/modules/base/services/BaseService';
import { provideSingleton, container } from '@/di/index';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { infrastructureDAO } from '@/modules/infrastructure/daos/infrastructureDAO';
import { IInfrastructureService } from '@/modules/infrastructure/interfaces/IInfrastructureService';
import { validate } from '@/decorators/validate';
import { safeGuard } from '@/decorators/safeGuard';
import { log } from '@/decorators/log';
import { validateParam } from '@/decorators/validateParam';
import { Result } from '@/utils/Result';
import { UpdateInfrastructureSchema } from '../schemas/ifrastructureSchemas';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { UpdateinfrastructureRO } from '../routes/RequestObject';

@provideSingleton(IInfrastructureService)
export class InfrastructureService extends BaseService<Infrastructure> implements IInfrastructureService {
  constructor(public dao: infrastructureDAO, public organizationService: IOrganizationService) {
    super(dao);
  }
  @log()
  @safeGuard()
  @validate
  public async updateinfrastructure(
    @validateParam(UpdateInfrastructureSchema) payload: UpdateinfrastructureRO,
    infraId: number,
  ): Promise<Result<number>> {
    const fetchedInfrastructure = await this.dao.get(infraId);
    if (!fetchedInfrastructure) {
      return Result.notFound(`Resource with id ${infraId} does not exist.`);
    }

    let organization = null;
    if (payload.organization) {
      const fetchedOrganization = await this.organizationService.get(payload.organization);
      if (!fetchedOrganization) {
        return Result.notFound(`Organization with id ${payload.organization} does not exist.`);
      }
      organization = fetchedOrganization.getValue();
    }

    const infrustructure = this.wrapEntity(fetchedInfrastructure, {
      ...fetchedInfrastructure,
      ...payload,
      organization,
    });

    const createdResource = await this.dao.update(infrustructure);
    if (!createdResource) {
      return Result.fail(`infrustructure with id ${infraId} can not be updated.`);
    }

    const id = createdResource.id;
    return Result.ok<number>(id);
  }

  static getInstance(): IInfrastructureService {
    return container.get(IInfrastructureService);
  }
}
