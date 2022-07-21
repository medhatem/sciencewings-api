import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import { Resource } from '@/modules/resources/models/Resource';
import { ResourceDao } from '@/modules/resources/daos/ResourceDao';
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';
import {
  ResourcesSettingsReservationGeneralRO,
  ResourcesSettingsReservationUnitRO,
  ResourceRateRO,
  ResourceTimerRestrictionRO,
  ResourceReservationVisibilityRO,
  UpdateResourceRO,
} from '@/modules/resources/routes/RequestObject';
import {
  ResourceCalendarSchema,
  CreateResourceSchema,
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
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { Member } from '@/modules/hr/models/Member';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { IResourceCalendarService } from '@/modules/resources/interfaces/IResourceCalendarService';
import { IResourceSettingsService } from '@/modules/resources/interfaces/IResourceSettingsService';
import { IResourceTagService } from '@/modules/resources/interfaces/IResourceTagService';
import { Organization } from '@/modules/organizations/models/Organization';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { applyToAll } from '@/utils/utilities';
import { IResourceStatusHistoryService } from '@/modules/resources/interfaces/IResourceStatusHistoryService';
import { IResourceStatusService } from '@/modules/resources/interfaces/IResourceStatusService';
import { NotFoundError, ValidationError } from '@/Exceptions';

@provideSingleton(IResourceService)
export class ResourceService extends BaseService<Resource> implements IResourceService {
  constructor(
    public dao: ResourceDao,
    public organizationService: IOrganizationService,
    public memberService: IMemberService,
    public resourceSettingsService: IResourceSettingsService,
    public resourceRateService: IResourceRateService,
    public resourceCalendarService: IResourceCalendarService,
    public resourceTagService: IResourceTagService,
    public resourceStatusHistoryService: IResourceStatusHistoryService,
    public resourceStatusService: IResourceStatusService,
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
  public async getResourcesOfAGivenOrganizationById(organizationId: number): Promise<Resource[]> {
    if (!organizationId) {
      throw new ValidationError('required {{field}}', { variables: { field: 'id' }, friendly: true });
    }
    const fetchedOrganization = await this.organizationService.get(organizationId);
    if (!fetchedOrganization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${organizationId}` } });
    }
    const resources = await this.dao.getByCriteria(
      {
        organization: organizationId,
      },
      FETCH_STRATEGY.ALL,
      { refresh: true },
    );

    return resources as Resource[];
  }

  @log()
  @validate
  public async createResource(@validateParam(CreateResourceSchema) payload: ResourceRO): Promise<number> {
    let organization: Organization = null;
    if (payload.organization) {
      const organization = await this.organizationService.get(payload.organization);
      if (!organization) {
        throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${payload.organization}` } });
      }
    }

    const managers: Member[] = [];
    if (payload.managers) {
      for await (const { organization, user } of payload.managers) {
        const fetcheManager = await this.memberService.getByCriteria({ organization, user }, FETCH_STRATEGY.SINGLE);
        if (!fetcheManager) {
          throw new NotFoundError('MEMBER.NON_EXISTANT', { friendly: true });
        }
        managers.push(fetcheManager);
      }
    }

    const resourceStatusSetting = await this.resourceStatusService.get(1);

    await this.resourceSettingsService.create({
      resourceType: resourceStatusSetting,
    });

    const createdResourceResult = await this.dao.create({
      name: payload.name,
      description: payload.description,
      active: payload.active,
      resourceType: payload.resourceType,
      resourceClass: payload.resourceClass,
      timezone: payload.timezone,
      organization,
      settings: resourceStatusSetting,
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
    return createdResourceResult.id;
  }

  @log()
  @validate
  public async updateResource(
    @validateParam(UpdateResourceSchema) payload: UpdateResourceRO,
    resourceId: number,
  ): Promise<number> {
    const fetchedResource = await this.dao.get(resourceId);
    if (!fetchedResource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', { variables: { resource: `${resourceId}` } });
    }

    let organization = null;
    if (payload.organization) {
      const fetchedOrganization = await this.organizationService.get(payload.organization);
      if (!fetchedOrganization) {
        throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${payload.organization}` } });
      }
      organization = fetchedOrganization;
    }

    const managers: Member[] = [];
    const delManagers: Member[] = [];
    if (payload.managers) {
      for await (const { organization, user } of payload.managers) {
        const fetcheManager = await this.memberService.getByCriteria({ organization, user }, FETCH_STRATEGY.SINGLE);
        if (!fetcheManager) {
          delManagers.push(fetcheManager);
        }
        managers.push(fetcheManager);
      }
    }

    const resource = this.wrapEntity(fetchedResource, {
      ...fetchedResource,
      name: payload.name || fetchedResource.name,
      description: payload.description || fetchedResource.description,
      active: payload.active || fetchedResource.active,
      resourceType: payload.resourceType || fetchedResource.resourceType,
      resourceClass: payload.resourceClass || fetchedResource.resourceClass,
      timezone: payload.timezone || fetchedResource.timezone,
      organization,
    });

    for (const manager of managers) {
      for (const existingManager of resource.managers) {
        if (manager.user.id == existingManager.user.id && manager.organization.id == existingManager.organization.id) {
          break;
        }
      }
      resource.managers.add(manager);
    }
    for (const manager of delManagers) {
      resource.managers.remove(manager);
    }

    const updatedResource = await this.dao.update(resource);

    return updatedResource.id;
  }

  @log()
  @validate
  public async createResourceCalendar(
    @validateParam(ResourceCalendarSchema) payload: ResourceCalendarRO,
  ): Promise<ResourceCalendar> {
    let organization = null;
    if (payload.organization) {
      organization = await this.organizationService.get(payload.organization);
      if (!organization) {
        throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${payload.organization}` } });
      }
    }

    const resourceCalendar: ResourceCalendar = this.resourceCalendarService.wrapEntity(new ResourceCalendar(), {
      ...payload,
      organization,
    });

    return await this.resourceCalendarService.create(resourceCalendar);
  }

  @log()
  public async getResourceSettings(resourceId: number): Promise<any> {
    const fetchedResource = await this.dao.get(resourceId);

    if (!fetchedResource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', {
        variables: { resource: `${resourceId}` },
      });
    }

    return fetchedResource.settings;
  }

  //Resource settings
  @log()
  @validate
  public async updateResourceReservationGeneral(
    @validateParam(ResourceReservationGeneralSchema) payload: ResourcesSettingsReservationGeneralRO,
    resourceId: number,
  ): Promise<number> {
    const fetchedResource = await this.dao.get(resourceId);
    if (!fetchedResource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', { variables: { resource: `${resourceId}` } });
    }

    const resource = this.wrapEntity(fetchedResource, {
      ...fetchedResource,
      settings: { ...fetchedResource.settings, ...payload },
    });

    const updatedResourceResult = await this.dao.update(resource);

    return updatedResourceResult.id;
  }

  @log()
  @validate
  public async updateResourcesSettingsGeneralStatus(
    @validateParam(ResourceGeneralStatusSchema) payload: ResourceSettingsGeneralStatusRO,
    resourceId: number,
  ): Promise<number> {
    const resource = await this.dao.get(resourceId);

    if (!resource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', {
        variables: { resource: `${resourceId}` },
      });
    }

    const member = await this.memberService.get(payload.memberId);

    if (!member) {
      throw new NotFoundError('MEMBER.NON_EXISTANT');
    }

    const resourceStatusHistory = await this.resourceStatusHistoryService.create({
      ...payload,
      resource,
      member,
    });

    return resourceStatusHistory.id;
  }

  @log()
  @validate
  public async updateResourceReservationUnits(
    @validateParam(ResourceReservationUnitSchema) payload: ResourcesSettingsReservationUnitRO,
    resourceId: number,
  ): Promise<number> {
    const fetchedResource = await this.dao.get(resourceId);
    if (!fetchedResource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', {
        variables: { resource: `${resourceId}` },
      });
    }
    const resourceValue = fetchedResource;

    const resource = this.wrapEntity(resourceValue, {
      ...resourceValue,
      settings: { ...resourceValue.settings, ...payload },
    });

    const updatedResourceResult = await this.dao.update(resource);

    return updatedResourceResult.id;
  }

  @log()
  @validate
  public async updateResourcesSettingsGeneralVisibility(
    @validateParam(ResourceGeneralVisibilitySchema) payload: ResourceSettingsGeneralVisibilityRO,
    resourceId: number,
  ): Promise<number> {
    const fetchedResource = await this.dao.get(resourceId);
    if (!fetchedResource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', {
        variables: { resource: `${resourceId}` },
      });
    }

    const resource = this.wrapEntity(fetchedResource, {
      ...fetchedResource,
      settings: { ...fetchedResource.settings, ...payload },
    });

    const updatedResourceResult = await this.dao.update(resource);

    return updatedResourceResult.id;
  }

  @log()
  @validate
  public async updateResourceReservationVisibility(
    @validateParam(ResourceReservationVisibilitySchema) payload: ResourceReservationVisibilityRO,
    resourceId: number,
  ): Promise<number> {
    const fetchedResource = await this.dao.get(resourceId);
    if (!fetchedResource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', {
        variables: { resource: `${resourceId}` },
      });
    }

    const resource = this.wrapEntity(fetchedResource, {
      ...fetchedResource,
      settings: { ...fetchedResource.settings, ...payload },
    });

    const updatedResourceResult = await this.dao.update(resource);

    return updatedResourceResult.id;
  }

  /**
   * updating only the specifed section of a resource settings
   * @param payload Resource Settings section General Properties payload
   * @param resourceId
   * @returns
   */
  @log()
  @validate
  public async updateResourcesSettingsnGeneralProperties(
    @validateParam(ResourceGeneralPropertiesSchema) payload: ResourceSettingsGeneralPropertiesRO,
    resourceId: number,
  ): Promise<number> {
    const fetchedResource = await this.dao.get(resourceId);
    if (!fetchedResource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', {
        variables: { resource: `${resourceId}` },
      });
    }

    const resource = this.wrapEntity(fetchedResource, {
      ...fetchedResource,
      settings: { ...fetchedResource.settings, ...payload },
    });

    const updatedResourceResult = await this.dao.update(resource);
    return updatedResourceResult.id;
  }

  @log()
  public async getResourceRate(resourceId: number): Promise<any> {
    const fetchedResource = await this.dao.get(resourceId);
    if (!fetchedResource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', {
        variables: { resource: `${resourceId}` },
      });
    }

    return await this.resourceRateService.getByCriteria({ resource: fetchedResource }, FETCH_STRATEGY.ALL);
  }

  @log()
  @validate
  public async createResourceRate(
    @validateParam(CreateResourceRateSchema) payload: ResourceRateRO,
    resourceId: number,
  ): Promise<number> {
    const fetchedResource = await this.dao.get(resourceId);
    if (!fetchedResource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', {
        variables: { resource: `${resourceId}` },
      });
    }

    const createdResourceRateResult = await this.resourceRateService.create({
      ...payload,
      fetchedResource,
    });

    return createdResourceRateResult.id;
  }

  @log()
  @validate
  public async updateResourceRate(
    @validateParam(UpdateResourceRateSchema) payload: ResourceRateRO,
    resourceRateId: number,
  ): Promise<number> {
    let resourceRate: ResourceRate = null;
    const fetchedResourceRate = await this.resourceRateService.get(resourceRateId);
    if (!fetchedResourceRate) {
      throw new NotFoundError('RESOURCE_RATE.NON_EXISTANT {{rate}}', {
        variables: { rate: `${resourceRateId}` },
      });
    }
    resourceRate = fetchedResourceRate;

    const updatedResourceRate = this.resourceRateService.wrapEntity(resourceRate, {
      ...resourceRate,
      ...payload,
    });
    const updatedResourceRateResult = await this.resourceRateService.update(updatedResourceRate);
    return updatedResourceRateResult.id;
  }

  @log()
  @validate
  public async updateResourceReservationTimerRestriction(
    @validateParam(UpdateResourceSchema) payload: ResourceTimerRestrictionRO,
    resourceId: number,
  ): Promise<number> {
    const fetchedResource = await this.dao.get(resourceId);
    if (!fetchedResource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', {
        variables: { resource: `${resourceId}` },
      });
    }

    const resource = this.wrapEntity(fetchedResource, {
      ...fetchedResource,
      settings: { ...fetchedResource.settings, ...payload },
    });

    const updatedResourceResult = await this.dao.update(resource);

    return updatedResourceResult.id;
  }
}
