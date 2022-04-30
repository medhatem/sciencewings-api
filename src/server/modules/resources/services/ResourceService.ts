import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import { Resource } from '@/modules/resources/models/Resource';
import { ResourceDao } from '@/modules/resources/daos/ResourceDao';
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';
import { safeGuard } from '@/decorators/safeGuard';
import { Result } from '@/utils/Result';
import {
  ResourcesSettingsReservationGeneralRO,
  ResourcesSettingsReservationUnitRO,
  ResourceRateRO,
  ResourceTimerRestrictionRO,
  ResourceReservationVisibilityRO,
} from '@/modules/resources/routes/RequestObject';
import {
  CreateResourceSchema,
  ResourceCalendarSchema,
  ResourceReservationGeneralSchema,
  ResourceReservationUnitSchema,
  ResourceReservationVisibilitySchema,
  UpdateResourceSchema,
} from '@/modules/resources/schemas/ResourceSchema';
import { CreateResourceRateSchema, UpdateResourceRateSchema } from '@/modules/resources/schemas/ResourceRateSchema';
import { ResourceRate } from '@/modules/resources/models/ResourceRate';
import { validate } from '@/decorators/validate';
import { validateParam } from '@/decorators/validateParam';
import { IResourceRateService } from '@/modules/resources/interfaces/IResourceRateService';
import {
  ResourceSettingsGeneralPropertiesRO,
  ResourceSettingsGeneralStatusRO,
  ResourceSettingsGeneralVisibilityRO,
} from '@/modules/resources/routes/RequestObject';
import {
  ResourceGeneralPropertiesSchema,
  ResourceGeneralStatusSchema,
  ResourceGeneralVisibilitySchema,
} from '@/modules/resources/schemas/ResourceSchema';
import { log } from '@/decorators/log';
import { ResourceCalendarRO, ResourceRO } from '@/modules/resources/routes/RequestObject';
import { ResourceCalendar } from '@/modules/resources/models/ResourceCalendar';
import { FETCH_STRATEGY } from '@/modules/base';
import { Member } from '@/modules/hr/models/Member';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { IResourceCalendarService } from '@/modules/resources/interfaces/IResourceCalendarService';
import { IResourceSettingsService } from '@/modules/resources/interfaces/IResourceSettingsService';
import { IResourceTagService } from '@/modules/resources/interfaces/IResourceTagService';
import { Organization } from '@/modules/organizations/models/Organization';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { applyToAll } from '@/utils/utilities';

@provideSingleton(IResourceService)
export class ResourceService extends BaseService<Resource> {
  constructor(
    public dao: ResourceDao,
    public organizationService: IOrganizationService,
    public memberService: IMemberService,
    public resourceSettingsService: IResourceSettingsService,
    public resourceRateService: IResourceRateService,
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
    const fetchedOrganization = await this.organizationService.get(organizationId);
    if (!fetchedOrganization) {
      return Result.notFound(`Organization with id ${organizationId} does not exist.`);
    }
    const resources = await this.dao.getByCriteria(
      {
        organization: organizationId,
      },
      FETCH_STRATEGY.ALL,
      { refresh: true },
    );

    return Result.ok(resources as Resource[]);
  }

  @log()
  @safeGuard()
  @validate
  public async createResource(@validateParam(CreateResourceSchema) payload: ResourceRO): Promise<Result<number>> {
    let organization: Organization = null;
    if (payload.organization) {
      const fetchedOrganization = await this.organizationService.get(payload.organization);
      if (fetchedOrganization.isFailure || !fetchedOrganization.getValue()) {
        return Result.notFound(`Organization with id ${payload.organization} does not exist.`);
      }
      organization = fetchedOrganization.getValue();
    }

    const managers: Member[] = [];
    if (payload.managers) {
      for await (const { organization, user } of payload.managers) {
        const fetcheManager = await this.memberService.getByCriteria({ organization, user }, FETCH_STRATEGY.SINGLE);
        console.log(fetcheManager);
        if (fetcheManager.isFailure || !fetcheManager.getValue()) {
          return Result.notFound(
            `Manager with user id ${user} in organization with id ${organization} does not exist.`,
          );
        }
        managers.push(fetcheManager.getValue());
      }
    }
    const resourceSetting = await this.resourceSettingsService.create({});
    if (resourceSetting.isFailure) {
      return resourceSetting;
    }

    const createdResourceResult = await this.dao.create({
      name: payload.name,
      description: payload.description,
      active: payload.active,
      resourceType: payload.resourceType,
      resourceClass: payload.resourceClass,
      timezone: payload.timezone,
      organization,
      settings: resourceSetting.getValue(),
    });

    await createdResourceResult.managers.init();
    for (const manager of managers) {
      createdResourceResult.managers.add(manager);
    }

    await applyToAll(
      payload.tags,
      async (tag) => {
        await this.resourceTagService.create({
          title: tag.title,
          resource: createdResourceResult,
        });
      },
      true,
    );

    await this.dao.update(createdResourceResult);
    await this.organizationService.update(organization);

    const id = createdResourceResult.id;
    return Result.ok<number>(id);
  }

  @log()
  @safeGuard()
  @validate
  public async updateResource(
    @validateParam(UpdateResourceSchema) payload: ResourceRO,
    resourceId: number,
  ): Promise<Result<number>> {
    const fetchedResource = await this.get(resourceId);
    if (!fetchedResource) {
      return Result.notFound(`Resource with id ${resourceId} does not exist.`);
    }

    let organization = null;
    if (payload.organization) {
      const fetchedOrganization = await this.organizationService.get(payload.organization);
      if (!fetchedOrganization) {
        return Result.notFound(`Organization with id ${payload.organization} does not exist.`);
      }
      organization = fetchedOrganization.getValue();
    }

    const fetchedResourceValue = fetchedResource.getValue();
    const resource = this.wrapEntity(fetchedResourceValue, {
      ...fetchedResourceValue,
      ...payload,
      organization,
    });

    const createdResource = await this.dao.update(resource);

    const id = createdResource.id;
    return Result.ok<number>(id);
  }

  @log()
  @safeGuard()
  @validate
  public async createResourceCalendar(
    @validateParam(ResourceCalendarSchema) payload: ResourceCalendarRO,
  ): Promise<Result<ResourceCalendar>> {
    let organization = null;
    if (payload.organization) {
      organization = await this.organizationService.get(payload.organization);
      if (!organization) {
        return Result.notFound(`Organization with id ${payload.organization} does not exist.`);
      }
    }

    const resourceCalendar: ResourceCalendar = this.resourceCalendarService.wrapEntity(
      new ResourceCalendar(),
      {
        ...payload,
        organization,
      },
      false,
    );

    const createdResourceCalendar = await this.resourceCalendarService.create(resourceCalendar);
    return Result.ok<any>(createdResourceCalendar);
  }

  @log()
  @safeGuard()
  public async getResourceSettings(resourceId: number): Promise<Result<any>> {
    const fetchedResource = await this.get(resourceId);

    if (fetchedResource.isFailure || !fetchedResource.getValue()) {
      return Result.notFound(`Resource with id ${resourceId} does not exist.`);
    }

    return Result.ok(fetchedResource.getValue().settings);
  }

  //Resource settings
  @log()
  @safeGuard()
  @validate
  public async updateResourceReservationGeneral(
    @validateParam(ResourceReservationGeneralSchema) payload: ResourcesSettingsReservationGeneralRO,
    resourceId: number,
  ): Promise<Result<number>> {
    const fetchedResource = await this.get(resourceId);
    if (!fetchedResource) {
      return Result.notFound(`Resource with id ${resourceId} does not exist.`);
    }
    const resourceValue = fetchedResource.getValue();

    const resource = this.wrapEntity(
      resourceValue,
      {
        ...resourceValue,
        settings: { ...resourceValue.settings, ...payload },
      },
      false,
    );

    const updatedResourceResult = await this.update(resource);
    if (updatedResourceResult.isFailure) {
      return updatedResourceResult;
    }

    return Result.ok<number>(updatedResourceResult.getValue().id);
  }

  @log()
  @safeGuard()
  @validate
  public async updateResourcesSettingsGeneralStatus(
    @validateParam(ResourceGeneralStatusSchema) payload: ResourceSettingsGeneralStatusRO,
    resourceId: number,
  ): Promise<Result<number>> {
    const fetchedResource = await this.get(resourceId);
    if (!fetchedResource) {
      return Result.notFound(`Resource with id ${resourceId} does not exist.`);
    }
    const resourceValue = fetchedResource.getValue();

    const resource = this.wrapEntity(
      resourceValue,
      {
        ...resourceValue,
        settings: { ...resourceValue.settings, ...payload },
      },
      false,
    );

    const updatedResourceResult = await this.update(resource);
    if (updatedResourceResult.isFailure) {
      return updatedResourceResult;
    }

    return Result.ok<number>(updatedResourceResult.getValue().id);
  }

  @log()
  @safeGuard()
  @validate
  public async updateResourceReservationUnits(
    @validateParam(ResourceReservationUnitSchema) payload: ResourcesSettingsReservationUnitRO,
    resourceId: number,
  ): Promise<Result<number>> {
    const fetchedResource = await this.get(resourceId);
    if (!fetchedResource) {
      return Result.notFound(`Resource with id ${resourceId} does not exist.`);
    }
    const resourceValue = fetchedResource.getValue();

    const resource = this.wrapEntity(
      resourceValue,
      {
        ...resourceValue,
        settings: { ...resourceValue.settings, ...payload },
      },
      false,
    );

    const updatedResourceResult = await this.update(resource);
    if (updatedResourceResult.isFailure) {
      return updatedResourceResult;
    }

    return Result.ok<number>(updatedResourceResult.getValue().id);
  }

  public async updateResourcesSettingsGeneralVisibility(
    @validateParam(ResourceGeneralVisibilitySchema) payload: ResourceSettingsGeneralVisibilityRO,
    resourceId: number,
  ): Promise<Result<number>> {
    const fetchedResource = await this.get(resourceId);
    if (!fetchedResource) {
      return Result.notFound(`Resource with id ${resourceId} does not exist.`);
    }
    const resourceValue = fetchedResource.getValue();

    const resource = this.wrapEntity(
      resourceValue,
      {
        ...resourceValue,
        settings: { ...resourceValue.settings, ...payload },
      },
      false,
    );

    const updatedResourceResult = await this.update(resource);
    if (updatedResourceResult.isFailure) {
      return updatedResourceResult;
    }
    return Result.ok<number>(updatedResourceResult.getValue().id);
  }

  @log()
  @safeGuard()
  @validate
  public async updateResourceReservationVisibility(
    @validateParam(ResourceReservationVisibilitySchema) payload: ResourceReservationVisibilityRO,
    resourceId: number,
  ): Promise<Result<number>> {
    const fetchedResource = await this.get(resourceId);
    if (!fetchedResource) {
      return Result.notFound(`Resource with id ${resourceId} does not exist.`);
    }
    const resourceValue = fetchedResource.getValue();

    const resource = this.wrapEntity(
      resourceValue,
      {
        ...resourceValue,
        settings: { ...resourceValue.settings, ...payload },
      },
      false,
    );

    const updatedResourceResult = await this.update(resource);
    if (updatedResourceResult.isFailure) {
      return updatedResourceResult;
    }

    return Result.ok<number>(updatedResourceResult.getValue().id);
  }

  /**
   * updating only the specifed section of a resource settings
   * @param payload Resource Settings section General Properties payload
   * @param resourceId
   * @returns
   */
  @log()
  @safeGuard()
  @validate
  public async updateResourcesSettingsnGeneralProperties(
    @validateParam(ResourceGeneralPropertiesSchema) payload: ResourceSettingsGeneralPropertiesRO,
    resourceId: number,
  ): Promise<Result<number>> {
    const fetchedResource = await this.get(resourceId);
    if (!fetchedResource) {
      return Result.notFound(`Resource with id ${resourceId} does not exist.`);
    }
    const resourceValue = fetchedResource.getValue();

    const resource = this.wrapEntity(
      resourceValue,
      {
        ...resourceValue,
        settings: { ...resourceValue.settings, ...payload },
      },
      false,
    );

    const updatedResourceResult = await this.update(resource);
    if (updatedResourceResult.isFailure) {
      return updatedResourceResult;
    }
    return Result.ok<number>(updatedResourceResult.getValue().id);
  }

  @log()
  @safeGuard()
  public async getResourceRate(resourceId: number): Promise<Result<any>> {
    let resource: Resource = null;
    const fetchedResource = await this.get(resourceId);
    if (fetchedResource.isFailure || !fetchedResource.getValue()) {
      return Result.notFound(`Resource with id ${resourceId} does not exist.`);
    }
    resource = fetchedResource.getValue();

    const getResourceRateResult = await this.resourceRateService.getByCriteria({ resource }, FETCH_STRATEGY.ALL);
    if (getResourceRateResult.isFailure) {
      return getResourceRateResult;
    }
    const getResourceRate = getResourceRateResult.getValue();
    return Result.ok<any>(getResourceRate);
  }

  @log()
  @safeGuard()
  @validate
  public async createResourceRate(
    @validateParam(CreateResourceRateSchema) payload: ResourceRateRO,
    resourceId: number,
  ): Promise<Result<number>> {
    let resource: Resource = null;
    const fetchedResource = await this.get(resourceId);
    if (fetchedResource.isFailure || !fetchedResource.getValue()) {
      return Result.notFound(`Resource with id ${resourceId} does not exist.`);
    }
    resource = fetchedResource.getValue();

    const createdResourceRateResult = await this.resourceRateService.create({
      ...payload,
      resource,
    });
    if (createdResourceRateResult.isFailure) {
      return createdResourceRateResult;
    }
    const createdResourceRate = createdResourceRateResult.getValue();
    return Result.ok<number>(createdResourceRate.id);
  }

  @log()
  @safeGuard()
  @validate
  public async updateResourceRate(
    @validateParam(UpdateResourceRateSchema) payload: ResourceRateRO,
    resourceRateId: number,
  ): Promise<Result<number>> {
    let resourceRate: ResourceRate = null;
    const fetchedResourceRate = await this.resourceRateService.get(resourceRateId);
    if (fetchedResourceRate.isFailure || fetchedResourceRate.getValue() === null) {
      return Result.notFound(`Resource Rate with id ${resourceRateId} does not exist.`);
    }
    resourceRate = fetchedResourceRate.getValue();

    const updatedResourceRate = this.resourceRateService.wrapEntity(
      resourceRate,
      {
        ...resourceRate,
        ...payload,
      },
      false,
    );

    const updatedResourceRateResult = await this.resourceRateService.update(updatedResourceRate);
    if (updatedResourceRateResult.isFailure) {
      return updatedResourceRateResult;
    }
    const id = updatedResourceRateResult.getValue().id;
    return Result.ok<number>(id);
  }

  @log()
  @safeGuard()
  @validate
  public async updateResourceReservationTimerRestriction(
    @validateParam(UpdateResourceSchema) payload: ResourceTimerRestrictionRO,
    resourceId: number,
  ): Promise<Result<number>> {
    const fetchedResource = await this.get(resourceId);
    if (fetchedResource.isFailure || !fetchedResource.getValue()) {
      return Result.notFound(`Resource with id ${resourceId} does not exist.`);
    }

    const resourceValue = fetchedResource.getValue();

    const resource = this.wrapEntity(
      resourceValue,
      {
        ...resourceValue,
        settings: { ...resourceValue.settings, ...payload },
      },
      false,
    );

    const updatedResourceResult = await this.update(resource);
    if (updatedResourceResult.isFailure) {
      return updatedResourceResult;
    }
    return Result.ok<number>(updatedResourceResult.getValue().id);
  }
}
