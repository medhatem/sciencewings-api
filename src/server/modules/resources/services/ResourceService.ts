import { container, provideSingleton } from '@di/index';
import { safeGuard } from '../../../decorators/safeGuard';
import { BaseService } from '../../base/services/BaseService';
import { CreateResourceRO } from '../routes/RequestObject';
import { CreateResourceSchema } from '../schemas/CreateResourceSchema';
import { Resource } from '../../resources/models/Resource';
import { ResourceDao } from '../daos/ResourceDao';
import { Result } from '@utils/Result';
import { UpdateResourceSchema } from './../schemas/CreateResourceSchema';
import { log } from '../../../decorators/log';
import { ResourceCalendar } from '../../resources/models/ResourceCalendar';
import { IResourceCalendarService, IResourceService } from '../interfaces';
import { IUserService } from '../../users/interfaces';
import { IOrganizationService } from '../../organizations/interfaces';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';

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
  @validate
  public async createResource(@validateParam(CreateResourceSchema) payload: CreateResourceRO): Promise<Result<number>> {
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

    payload.organization = organization;

    const resource = this.wrapEntity(this.dao.model, {
      name: payload.name,
      active: payload.active,
      organization: payload.organization,
      resourceType: payload.resourceType,
      user: payload.user,
      timeEfficiency: payload.timeEfficiency,
      timezone: payload.timezone,
      calendar: payload.calendar,
    });

    const createResourceCalendar = await this.resourceCalendarService.createResourceCalendar(calendar);

    if (createResourceCalendar.isFailure) {
      return Result.fail<number>(createResourceCalendar.error);
    }
    resource.calendar = createResourceCalendar.getValue() as ResourceCalendar;
    const createdResource = await this.create({ ...resource, user });
    if (createdResource.isFailure) {
      return Result.fail<number>(createdResource.error);
    }
    const id = createdResource.getValue().id;
    return Result.ok<number>(id);
  }

  @log()
  @safeGuard()
  @validate
  public async updateResource(
    @validateParam(UpdateResourceSchema) payload: CreateResourceRO,
    resourceId: number,
  ): Promise<Result<number>> {
    const fetchedResource = await this.dao.get(resourceId);
    if (!fetchedResource) {
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
    }

    let user = null;

    if (payload.user) {
      const _user = await this.userService.getUserByCriteria({ id: payload.user });
      if (!_user) {
        return Result.fail<number>(`User with id ${payload.user} does not exist.`);
      }
      user = _user.getValue();
    }

    if (payload.organization) {
      const _organization = await this.organisationService.get(payload.organization);
      if (!_organization) {
        return Result.fail<number>(`Organization with id ${payload.organization} does not exist.`);
      }
      payload.organization = await _organization.getValue();
    }

    if (payload.calendar) {
      delete payload.calendar;
      const updatedResourceCalendar = await this.resourceCalendarService.update(payload.calendar);
      if (updatedResourceCalendar.isFailure) {
        return Result.fail<number>(updatedResourceCalendar.error);
      }
      payload.calendar = await updatedResourceCalendar.getValue();
    }

    const resource = this.wrapEntity(fetchedResource, {
      ...fetchedResource,
      ...payload,
    });

    const createdResource = await this.create({ ...resource, user });
    if (createdResource.isFailure) {
      return Result.fail<number>(createdResource.error);
    }
    const id = createdResource.getValue().id;
    return Result.ok<number>(id);
  }
}
