import { OrganizationService } from '@modules/organizations/services/OrganizationService';
import { ResourceCalendarService } from './ResourceCalendarService';
import { UserService } from './../../users/services/UserService';
import { Result } from '@utils/Result';
import { container, provideSingleton } from '@di/index';
import CreateResourceSchema from '../schemas/CreateResourceSchema';
import { BaseService } from '@modules/base/services/BaseService';
import { Resource } from '@modules/resources/models/Resource';
import { ResourceDao } from '../daos/ResourceDao';
import { CreateResourceRO } from '../routes/RequestObject';
import { safeGuard } from '../../../decorators/safeGuard';
import { log } from '../../../decorators/log';
import { validate } from '../../../decorators/bodyValidationDecorators/validate';

@provideSingleton()
export class ResourceService extends BaseService<Resource> {
  constructor(
    public dao: ResourceDao,
    public userService: UserService,
    public organisationService: OrganizationService,
    public resourceCalendarService: ResourceCalendarService,
  ) {
    super(dao);
  }

  static getInstance(): ResourceService {
    return container.get(ResourceService);
  }

  @log()
  @safeGuard()
  @validate(CreateResourceSchema)
  public async createResource(payload: CreateResourceRO): Promise<Result<number>> {
    const calendar = payload.calendar;
    delete payload.calendar;

    const resource = this.wrapEntity(this.dao.model, payload);

    if (payload.user) {
      const user = await this.userService.get(payload.user);
      if (!user) {
        return Result.fail<number>(`User with id ${payload.user} dose not exists.`);
      }
      resource.user = user;
    }

    if (payload.organization) {
      const organization = await this.organisationService.get(payload.organization);
      if (!organization) {
        return Result.fail<number>(`Organization with id ${payload.organization} dose not exists.`);
      }
      resource.organization = organization;
    }

    const createResourceCalendar = await this.resourceCalendarService.createResourceCalendar(calendar);
    const calendarEntity = createResourceCalendar.getValue();
    if (typeof calendarEntity === 'string') {
      return Result.fail<number>(calendarEntity);
    }
    resource.calendar = calendarEntity;
    const createdResource = await this.create(resource);
    return Result.ok<number>(createdResource.id);
  }
}
