import { User } from '@/modules/users/models/User';
import { Organization } from '@/modules/organizations/models/Organization';
import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { CreateResourceRO } from '../routes/RequestObject';
import { CreateResourceSchema } from '../schemas/CreateResourceSchema';

import { Resource } from '@/modules/resources/models/Resource';
import { ResourceDao } from '../daos/ResourceDao';
import { Result } from '@/utils/Result';
import { UpdateResourceSchema } from './../schemas/CreateResourceSchema';
import { safeGuard } from '@/decorators/safeGuard';
import { log } from '@/modules/../decorators/log';
import { ResourceCalendar } from '@/modules/resources/models/ResourceCalendar';
import { IResourceCalendarService, IResourceService } from '../interfaces';
import { IUserService } from '@/modules/users/interfaces';
import { IOrganizationService } from '@/modules/organizations/interfaces';
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

  /**
   * retrieve all resources of a given organization by id
   *
   * @param organizationId organization id
   * @return list of the resources that match the criteria
   */
  @log()
  @safeGuard()
  public async getResourcesOfAGivenOrganizationById(organizationId: number): Promise<Result<Resource[]>> {
    if (!organizationId) {
      return Result.fail(`Organization id should be provided.`);
    }
    const fetchedOrganization = await this.organisationService.get(organizationId);
    if (!fetchedOrganization) {
      return Result.fail(`Organization with id ${organizationId} does not exist.`);
    }
    const resources = await this.dao.getAllByCriteria({ organization: organizationId });
    return Result.ok(resources);
  }

  @log()
  @safeGuard()
  @validate
  public async createResource(@validateParam(CreateResourceSchema) payload: CreateResourceRO): Promise<Result<number>> {
    let user: User = null;
    let organization: Organization = null;

    if (payload.user) {
      const fetchedUser = await this.userService.getUserByCriteria({ id: payload.user });
      if (fetchedUser.isFailure || !fetchedUser) {
        return Result.fail<number>(`User with id ${payload.user} does not exist.`);
      }
      user = fetchedUser.getValue();
    }

    if (payload.organization) {
      const fetchedOrganization = await this.organisationService.get(payload.organization);
      if (fetchedOrganization.isFailure || !fetchedOrganization) {
        return Result.fail<number>(`Organization with id ${payload.organization} does not exist.`);
      }
      organization = fetchedOrganization.getValue();
    }

    const resource = this.wrapEntity(this.dao.model, {
      name: payload.name,
      active: payload.active,
      resourceType: payload.resourceType,
      timeEfficiency: payload.timeEfficiency,
      timezone: payload.timezone,
    });

    resource.organization = organization;
    resource.user = user;

    const createResourceCalendar = await this.resourceCalendarService.createResourceCalendar(payload.calendar);

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
      const fetchedUser = await this.userService.getUserByCriteria({ id: payload.user });
      if (fetchedUser.isFailure || !fetchedUser) {
        return Result.fail<number>(`User with id ${payload.user} does not exist.`);
      }
      user = fetchedUser.getValue();
    }

    if (payload.organization) {
      const fetchedOrganization = await this.organisationService.get(payload.organization);
      if (fetchedOrganization.isFailure || !fetchedOrganization) {
        return Result.fail<number>(`Organization with id ${payload.organization} does not exist.`);
      }
      payload.organization = fetchedOrganization.getValue();
    }

    if (payload.calendar) {
      delete payload.calendar;
      const updatedResourceCalendar = await this.resourceCalendarService.update(payload.calendar);
      if (updatedResourceCalendar.isFailure) {
        return Result.fail<number>(updatedResourceCalendar.error);
      }
      payload.calendar = updatedResourceCalendar.getValue();
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
