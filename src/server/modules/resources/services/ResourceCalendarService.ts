import { OrganizationService } from '@modules/organizations/services/OrganizationService';
import { Result } from '@utils/Result';
import { container, provideSingleton } from '@di/index';
import { BaseService } from '@modules/base/services/BaseService';
import { CreateResourceCalendarRO } from '../routes/RequestObject';
import { safeGuard } from '../../../decorators/safeGuard';
import { log } from '../../../decorators/log';
import { ResourceCalendar } from '../models/ResourceCalendar';
import { ResourceCalendarDao } from '../daos/ResourceCalendarDAO';

@provideSingleton()
export class ResourceCalendarService extends BaseService<ResourceCalendar> {
  constructor(public dao: ResourceCalendarDao, public organisationService: OrganizationService) {
    super(dao);
  }

  static getInstance(): ResourceCalendarService {
    return container.get(ResourceCalendarService);
  }

  @log()
  @safeGuard()
  public async createResourceCalendar(payload: CreateResourceCalendarRO): Promise<Result<ResourceCalendar | string>> {
    let org = null;
    if (payload.organization) {
      org = await this.organisationService.get(payload.organization);
      if (!org) {
        return Result.fail<string>(`Organization with id ${payload.organization} does not exist.`);
      }
    }

    const resourceCalendar: ResourceCalendar = {
      id: null,
      ...payload,
      organization: org,
    };

    const createdResourceCalendar = await this.dao.create(resourceCalendar);
    return Result.ok<ResourceCalendar>(createdResourceCalendar);
  }
}
