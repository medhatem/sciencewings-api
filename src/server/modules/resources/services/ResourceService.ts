import { User } from '@/modules/users/models/User';
import { Organization } from '@/modules/organizations/models/Organization';
import { container, ingest, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { ResourceRO } from '@/modules/resources/routes/RequestObject';
import { CreateResourceSchema } from '@/modules/resources/schemas/ResourceSchema';

import { Resource } from '@/modules/resources/models/Resource';
import { ResourceDao } from '@/modules/resources/daos/ResourceDao';
import { Result } from '@/utils/Result';
import { UpdateResourceSchema } from '@/modules/resources/schemas/ResourceSchema';
import { safeGuard } from '@/decorators/safeGuard';
import { log } from '@/decorators/log';
import { ResourceCalendar } from '@/modules/resources/models/ResourceCalendar';
import { IResourceCalendarService } from '@/modules/resources/interfaces/IResourceCalendarService';
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';
import { IResourceTagService } from '@/modules/resources/interfaces/IResourceTagService';
import { IUserService } from '@/modules/users/interfaces';
import { IOrganizationService } from '@/modules/organizations/interfaces';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';
import { FETCH_STRATEGY } from '@/modules/base';
import { applyToAll } from '@/utils/utilities';

@provideSingleton(IResourceService)
export class ResourceService extends BaseService<Resource> {
  @ingest(IOrganizationService) organisationService: IOrganizationService;
  constructor(
    public dao: ResourceDao,
    public userService: IUserService,
    public resourceCalendarService: IResourceCalendarService,
    public resourceTagService: IResourceTagService,
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
    const resources = (await this.dao.getByCriteria(
      { organization: organizationId },
      FETCH_STRATEGY.ALL,
    )) as Resource[];
    return Result.ok(resources);
  }

  @log()
  @safeGuard()
  @validate
  public async createResource(@validateParam(CreateResourceSchema) payload: ResourceRO): Promise<Result<number>> {
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
      description: payload.description,
      active: payload.active,
      resourceType: payload.resourceType,
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

    await applyToAll(payload.tags, async (tag) => {
      await this.resourceTagService.create({
        title: tag.title,
        resource: createdResource.getValue(),
      });
    });

    const id = createdResource.getValue().id;
    return Result.ok<number>(id);
  }

  @log()
  @safeGuard()
  @validate
  public async updateResource(
    @validateParam(UpdateResourceSchema) payload: ResourceRO,
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
