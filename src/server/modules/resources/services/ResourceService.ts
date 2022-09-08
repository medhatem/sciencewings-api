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
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { IResourceCalendarService } from '@/modules/resources/interfaces/IResourceCalendarService';
import { IResourceSettingsService } from '@/modules/resources/interfaces/IResourceSettingsService';
import { IResourceTagService } from '@/modules/resources/interfaces/IResourceTagService';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { IResourceStatusHistoryService } from '@/modules/resources/interfaces/IResourceStatusHistoryService';
import { IResourceStatusService } from '@/modules/resources/interfaces/IResourceStatusService';
import { NotFoundError, ValidationError } from '@/Exceptions';
import { StatusCases } from '@/modules/resources/models/ResourceStatus';
import { Member } from '@/modules/hr/models/Member';
import { ResourceTag } from '@/modules/resources/models/ResourceTag';
import { applyToAll } from '@/utils/utilities';
@provideSingleton(IResourceService)
export class ResourceService extends BaseService<Resource> implements IResourceService {
  constructor(
    public dao: ResourceDao,
    public organizationService: IOrganizationService,
    public memberService: IMemberService,
    public userService: IUserService,
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

    {
      const fetchedOrganization = await this.organizationService.get(organizationId);
      if (!fetchedOrganization) {
        throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${organizationId}` } });
      }
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
  public async createResource(
    userId: number,
    @validateParam(CreateResourceSchema) payload: ResourceRO,
  ): Promise<number> {
    const organization = await this.organizationService.get(payload.organization);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${payload.organization}` } });
    }
    const wrappedResource = this.wrapEntity(Resource.getInstance(), {
      name: payload.name,
      resourceType: payload.resourceType,
      resourceClass: payload.resourceClass,
      active: true,
    });

    wrappedResource.organization = organization;
    const user = await this.userService.getByCriteria({ id: userId }, FETCH_STRATEGY.SINGLE);
    const manager = (await this.memberService.getByCriteria({ organization, user }, FETCH_STRATEGY.SINGLE)) as Member;
    if (!manager) {
      throw new NotFoundError('USER.NON_EXISTANT {{user}}', {
        variables: { user: `${payload.managers}` },
      });
    }
    const resourceStatus = await this.resourceStatusService.create({
      statusType: StatusCases.OPERATIONAL,
      statusDescription: '',
    });
    wrappedResource.status = resourceStatus;

    const resourceSetting = await this.resourceSettingsService.create({});
    wrappedResource.settings = resourceSetting;
    const calendar = await this.resourceCalendarService.create({
      name: `${wrappedResource.name}-calendar`,
      active: true,
      organization: organization,
    });

    console.log('calendar is ', calendar);
    const createdResource = await this.create(wrappedResource);
    await createdResource.managers.init();
    createdResource.managers.add(manager);
    await wrappedResource.calendar.init();
    wrappedResource.calendar.add(calendar);
    await this.update(createdResource);
    return createdResource.id;
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
    const organization = await this.organizationService.get(payload.organization);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${payload.organization}` } });
    }

    const resource = this.wrapEntity(fetchedResource, {
      ...fetchedResource,
      name: payload.name || fetchedResource.name,
      description: payload.description || fetchedResource.description,
      active: payload.active || fetchedResource.active,
      statusType: payload.resourceType || fetchedResource.resourceType,
      resourceClass: payload.resourceClass || fetchedResource.resourceClass,
      timezone: payload.timezone || fetchedResource.timezone,
    });

    let existingTags: any[] = [];
    let newTags: any[] = [];

    if (payload.tags) {
      /**
       *for @param payload.tags
       * if id exists so the tag is already created and we need just to update
       * if the one tag doesn't have an id so we need to create it
       */
      payload.tags.map((tag) => ('id' in tag ? existingTags.push(tag) : newTags.push(tag)));
      await fetchedResource.tags.init();
      await applyToAll(existingTags, async (existingTag) => {
        let fetchedExistingTag = await this.resourceTagService.getByCriteria(
          {
            id: existingTag.id,
            organization,
          },
          FETCH_STRATEGY.SINGLE,
        );
        if (!fetchedExistingTag) {
          throw new NotFoundError('RESOURCE_TAG.NON_EXISTANT {{tag}}', {
            variables: { tag: `${existingTag.id}` },
          });
        }
        fetchedResource.tags.add(fetchedExistingTag);
      });

      await applyToAll(newTags, async (newTag) => {
        let tag: ResourceTag = this.resourceTagService.wrapEntity(ResourceTag.getInstance(), {
          title: newTag.title,
        });
        const createdTag = await this.resourceTagService.create(tag);
        createdTag.organization = organization;
        await this.resourceTagService.update(createdTag);
        fetchedResource.tags.add(createdTag);
      });
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

    return { ...fetchedResource.settings, ...fetchedResource.status };
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

    const organization = await this.organizationService.get(payload.organization);
    const user = await this.userService.getByCriteria({ id: payload.user }, FETCH_STRATEGY.SINGLE);

    const member = await this.memberService.getByCriteria({ user, organization }, FETCH_STRATEGY.SINGLE);

    if (!member) {
      throw new NotFoundError('MEMBER.NON_EXISTANT');
    }
    resource.status.statusType = payload.statusType;
    resource.status.statusDescription = payload.statusDescription;
    await this.dao.update(resource);

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
  public async updateResourceReservationTimerRestriction(
    payload: ResourceTimerRestrictionRO,
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
