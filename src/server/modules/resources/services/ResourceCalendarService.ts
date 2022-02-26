import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { CreateResourceCalendarRO } from '../routes/RequestObject';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { Result } from '@/utils/Result';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';
import { ResourceCalendar } from '../models/ResourceCalendar';
import { ResourceCalendarDao } from '../daos/ResourceCalendarDAO';
import { ResourceCalendarSchema } from '../schemas/CreateResourceSchema';
import { IResourceCalendarService } from '../interfaces';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';

@provideSingleton(IResourceCalendarService)
export class ResourceCalendarService extends BaseService<ResourceCalendar> {
  constructor(public dao: ResourceCalendarDao, public organisationService: IOrganizationService) {
    super(dao);
  }

  static getInstance(): IResourceCalendarService {
    return container.get(IResourceCalendarService);
  }

  @log()
  @safeGuard()
  @validate
  public async createResourceCalendar(
    @validateParam(ResourceCalendarSchema) payload: CreateResourceCalendarRO,
  ): Promise<Result<ResourceCalendar>> {
    let org = null;
    let organization = null;
    if (payload.organization) {
      org = await this.organisationService.get(payload.organization);
      if (!org) {
        return Result.fail(`Organization with id ${payload.organization} does not exist.`);
      }
      organization = await org.getValue();
    }

    const resourceCalendar: ResourceCalendar = {
      id: null,
      ...payload,
      organization,
    };

    const createdResourceCalendar = await this.dao.create(resourceCalendar);
    return Result.ok<ResourceCalendar>(createdResourceCalendar);
  }
}
