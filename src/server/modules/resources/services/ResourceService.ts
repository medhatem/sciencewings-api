import { OrganizationService } from '@modules/organizations/services/OrganizationService';
import { ResourceCalendarService } from './ResourceCalendarService';
import { UserService } from './../../users/services/UserService';
import { Result } from '@utils/Result';
import { container, provideSingleton } from '@di/index';
import { CreateResourceSchema } from '../schemas/CreateResourceSchema';
import { BaseService } from '@modules/base/services/BaseService';
import { Resource } from '@modules/resources/models/Resource';
import { ResourceDao } from '../daos/ResourceDao';
import { CreateResourceRO } from '../routes/RequestObject';
import { safeGuard } from '../../../decorators/safeGuard';
import { log } from '../../../decorators/log';
import { validate } from '../../../decorators/bodyValidationDecorators/validate';
import { ResourceCalendar } from '../models/ResourceCalendar';

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
    let user = null;
    let organization = null;

    if (payload.user) {
      const _user = await this.userService.get(payload.user);
      if (!_user) {
        return Result.fail<number>(`User with id ${payload.user} does not exist.`);
      }
      user = await _user.getValue();
    }

    if (payload.organization) {
      const _organization = await this.organisationService.get(payload.organization);
      if (!_organization) {
        return Result.fail<number>(`Organization with id ${payload.organization} does not exist.`);
      }
      organization = await _organization.getValue();
    }

    const calendar = payload.calendar;
    delete payload.calendar;

    payload.user = user;
    payload.organization = organization;

    const resource = this.wrapEntity(this.dao.model, payload);

    const createResourceCalendar = await this.resourceCalendarService.createResourceCalendar(calendar);

    if (createResourceCalendar.isFailure) {
      return Result.fail<number>(createResourceCalendar.error);
    }
    resource.calendar = createResourceCalendar.getValue() as ResourceCalendar;
    const createdResource = await this.create(resource);
    if (createdResource.isFailure) {
      return Result.fail<number>(createdResource.error);
    }
    const id = createdResource.getValue().id;
    return Result.ok<number>(id);
  }
}
