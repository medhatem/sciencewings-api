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
import { IResourceCalendarService, IResourceService } from '../interfaces';
import { IUserService } from '@modules/users/interfaces';
import { IOrganizationService } from '@modules/organizations/interfaces';

@provideSingleton(IResourceService)
export class ResourceService extends BaseService<Resource> {
  constructor(
    public dao: ResourceDao,
    public userService: IUserService,
    public organisationService: IOrganizationService,
    public resourceCalendarService: IResourceCalendarService,
  ) {
    super(dao);
  }

  static getInstance(): IResourceService {
    return container.get(IResourceService);
  }

  @log()
  @safeGuard()
  @validate(CreateResourceSchema)
  public async createResource(payload: CreateResourceRO): Promise<Result<number>> {
    let user = null;
    let organization = null;

    if (payload.user) {
      const _user = await this.userService.getUserByCriteria({ id: payload.user });
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
