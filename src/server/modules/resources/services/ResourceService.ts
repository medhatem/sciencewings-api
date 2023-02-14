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
import { Calendar } from '@/modules/reservation/models/Calendar';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { ICalendarService } from '@/modules/reservation/interfaces/ICalendarService';
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
import { applyToAll, paginate } from '@/utils/utilities';
import { IInfrastructureService, Infrastructure } from '@/modules/infrastructure';
import { User } from '@/modules/users/models/User';
import { ResourcesList } from '@/types/types';
import { KeycloakUtil } from '@/sdks/keycloak/KeycloakUtils';
import { IPermissionService } from '@/modules/permissions/interfaces/IPermissionService';
import { ResourceSettings } from '@/modules/resources/models/ResourceSettings';
import { LoanableResourceDao } from '@/modules/resources/daos/LoanableResourceDao';

@provideSingleton(IResourceService)
export class ResourceService extends BaseService<Resource> implements IResourceService {
  constructor(
    public dao: ResourceDao,
    public organizationService: IOrganizationService,
    public memberService: IMemberService,
    public userService: IUserService,
    public resourceSettingsService: IResourceSettingsService,
    public resourceRateService: IResourceRateService,
    public resourceCalendarService: ICalendarService,
    public resourceTagService: IResourceTagService,
    public resourceStatusHistoryService: IResourceStatusHistoryService,
    public resourceStatusService: IResourceStatusService,
    public infrastructureService: IInfrastructureService,
    public keycloakUtils: KeycloakUtil,
    public permissionService: IPermissionService,
    public loanableResourceDao: LoanableResourceDao,
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
  public async getResourcesOfAGivenOrganizationById(
    organizationId: number,
    page?: number,
    size?: number,
    query?: string,
  ): Promise<ResourcesList> {
    if (!organizationId) {
      throw new ValidationError('required {{field}}', { variables: { field: 'id' }, friendly: true });
    }

    const organization = await this.organizationService.get(organizationId);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${organizationId}` } });
    }

    const length = await this.dao.count({ organization });

    let resources;

    if (page | size) {
      const skip = page * size;
      if (query) {
        resources = (await this.dao.getByCriteria(
          { organization, name: { $like: '%' + query + '%' } },
          FETCH_STRATEGY.ALL,
          {
            offset: skip,
            limit: size,
          },
        )) as Resource[];
      } else {
        resources = (await this.dao.getByCriteria({ organization }, FETCH_STRATEGY.ALL, {
          offset: skip,
          limit: size,
        })) as Resource[];
      }

      const { data, pagination } = paginate(resources, page, size, skip, length);
      const result: ResourcesList = {
        data,
        pagination,
      };
      return result;
    }

    resources = (await this.dao.getByCriteria({ organization }, FETCH_STRATEGY.ALL, {
      populate: ['settings', 'status', 'infrastructure', 'managers', 'tags', 'calendar'] as never,
    })) as Resource[];
    const result: ResourcesList = {
      data: resources,
    };
    return result;
  }

  /**
   * Fetch resource and initialize all the collections
   */
  @log()
  async getResourceById(resourceId: number): Promise<Resource> {
    const resource = await this.dao.get(resourceId, {
      populate: ['settings', 'status', 'infrastructure', 'managers', 'tags', 'calendar'] as never,
    });
    return resource;
  }

  /**
   * Fetch all loanable resources and initialize all the collections
   */
  @log()
  async getAllLoanableResources(query?: string): Promise<Resource[]> {
    const resourcesSettings: ResourceSettings[] = (await this.resourceSettingsService.getByCriteria(
      { isLoanable: true },
      FETCH_STRATEGY.ALL,
    )) as ResourceSettings[];
    let resources: Resource[] = [];
    if (query) {
      resourcesSettings.map(async (settings) => {
        let resource = (await this.dao.getByCriteria(
          { settings, name: { $like: '%' + query + '%' } },
          FETCH_STRATEGY.ALL,
          {
            populate: ['settings', 'status', 'infrastructure', 'managers', 'tags', 'calendar'] as never,
          },
        )) as Resource;
        resources.push(resource);
      });
    } else {
      resourcesSettings.map(async (settings) => {
        let resource = (await this.dao.getByCriteria({ settings }, FETCH_STRATEGY.ALL, {
          populate: ['settings', 'status', 'infrastructure', 'managers', 'tags', 'calendar'] as never,
        })) as Resource;
        resources.push(resource);
      });
    }
    return resources;
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

    const fetchedInfrastructure = (await this.infrastructureService.get(payload.infrastructure)) as Infrastructure;
    if (!fetchedInfrastructure) {
      throw new NotFoundError('INFRA.NON_EXISTANT_DATA {{infra}}', {
        variables: { infra: `${payload.infrastructure}` },
      });
    }

    const wrappedResource = this.wrapEntity(Resource.getInstance(), {
      name: payload.name,
      description: payload.name || null,
      resourceType: payload.resourceType,
      resourceClass: payload.resourceClass,
      active: true,
    });

    wrappedResource.infrastructure = fetchedInfrastructure;
    wrappedResource.organization = organization;

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

    const createdResource = await this.create(wrappedResource);
    if (!payload.managers) {
      const user = await this.userService.getByCriteria({ id: userId }, FETCH_STRATEGY.SINGLE);
      const manager = (await this.memberService.getByCriteria({ organization, user }, FETCH_STRATEGY.SINGLE)) as Member;
      if (!manager) {
        throw new NotFoundError('USER.NON_EXISTANT {{user}}', {
          variables: { user: `${payload.managers}` },
        });
      }
      await wrappedResource.managers.init();
      wrappedResource.managers.add(manager);
    } else {
      await wrappedResource.managers.init();
      await applyToAll(payload.managers, async (managerId) => {
        const user = await this.userService.getByCriteria({ id: managerId }, FETCH_STRATEGY.SINGLE);
        const manager = (await this.memberService.getByCriteria(
          { organization, user },
          FETCH_STRATEGY.SINGLE,
        )) as Member;
        if (!manager) {
          throw new NotFoundError('USER.NON_EXISTANT {{user}}', {
            variables: { user: `${payload.managers}` },
          });
        }
        wrappedResource.managers.add(manager);
      });
    }
    await wrappedResource.calendar.init();
    wrappedResource.calendar.add(calendar);
    await this.update(createdResource);
    //TODO should create the ck permissions related to the created resource
    // const BDPermissions = (await this.permissionService.getByCriteria(
    //   { module: 'resource', operationDB: 'create' },
    //   FETCH_STRATEGY.ALL,
    // )) as Permission[];
    // if (BDPermissions) {
    //   for (const permission of BDPermissions) {
    //     this.keycloakUtils.createRealmRole(`${organization.kcid}-${permission.name}-${createdResource.id}`);
    //     const currentRole = await this.keycloakUtils.findRoleByName(
    //         `${organization.kcid}-${permission.name}-${createdResource.id}`);
    //     this.keycloakUtils.groupRoleMap(organization.adminGroupkcid, currentRole);
    //   }
    // }
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
      name: payload.name || fetchedResource.name,
      description: payload.description || fetchedResource.description,
      active: payload.active || fetchedResource.active,
      statusType: payload.resourceType || fetchedResource.resourceType,
      resourceClass: payload.resourceClass || fetchedResource.resourceClass,
      timezone: payload.timezone || fetchedResource.timezone,
    });

    if (payload.infrastructure) {
      const fetchedInfrastructure = (await this.infrastructureService.get(payload.infrastructure)) as Infrastructure;
      if (!fetchedInfrastructure) {
        throw new NotFoundError('INFRA.NON_EXISTANT_DATA {{infra}}', {
          variables: { infra: `${payload.infrastructure}` },
        });
      }
      resource.infrastructure = fetchedInfrastructure;
    }

    const existingTags: any[] = [];
    const newTags: any[] = [];

    if (payload.tags) {
      /**
       *for @param payload.tags
       * if id exists so the tag is already created and we need just to update
       * if the one tag doesn't have an id so we need to create it
       */
      payload.tags.map((tag) => ('id' in tag ? existingTags.push(tag) : newTags.push(tag)));
      await fetchedResource.tags.init();
      await applyToAll(existingTags, async (existingTag) => {
        const fetchedExistingTag = await this.resourceTagService.getByCriteria(
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
        resource.tags.add(fetchedExistingTag);
      });

      await applyToAll(newTags, async (newTag) => {
        const tag: ResourceTag = this.resourceTagService.wrapEntity(ResourceTag.getInstance(), {
          title: newTag.title,
        });
        const createdTag = await this.resourceTagService.create(tag);
        createdTag.organization = organization;
        await this.resourceTagService.update(createdTag);
        resource.tags.add(createdTag);
      });
    }

    const updatedResource = await this.dao.update(resource);

    return updatedResource.id;
  }

  @log()
  @validate
  public async createResourceCalendar(
    @validateParam(ResourceCalendarSchema) payload: ResourceCalendarRO,
  ): Promise<Calendar> {
    let organization = null;
    if (payload.organization) {
      organization = await this.organizationService.get(payload.organization);
      if (!organization) {
        throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${payload.organization}` } });
      }
    }

    const resourceCalendar: Calendar = this.resourceCalendarService.wrapEntity(new Calendar(), {
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

    const fetchedResourceSettings = await this.resourceSettingsService.get(fetchedResource.settings.id);
    const settings = this.resourceSettingsService.wrapEntity(fetchedResourceSettings, {
      ...fetchedResourceSettings,
      ...payload,
    });

    await this.resourceSettingsService.update(settings);

    return fetchedResource.id;
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

    const fetchedResourceSettings = await this.resourceSettingsService.get(fetchedResource.settings.id);

    const resource = this.wrapEntity(resourceValue, {
      ...resourceValue,
      settings: { ...fetchedResourceSettings, ...payload },
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
    const fetchedResource = await this.dao.get(resourceId, {
      populate: ['settings'] as never,
    });
    if (!fetchedResource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', {
        variables: { resource: `${resourceId}` },
      });
    }

    const fetchedResourceSettings = await this.resourceSettingsService.get(fetchedResource.settings.id);
    const settings = this.resourceSettingsService.wrapEntity(fetchedResourceSettings, {
      ...fetchedResourceSettings,
      ...payload,
    });

    await this.resourceSettingsService.update(settings);

    return fetchedResource.id;
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
    const fetchedResource = await this.dao.get(resourceId, {
      populate: ['settings'] as never,
    });
    if (!fetchedResource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', {
        variables: { resource: `${resourceId}` },
      });
    }

    const fetchedResourceSettings = await this.resourceSettingsService.get(fetchedResource.settings.id);
    const settings = this.resourceSettingsService.wrapEntity(fetchedResourceSettings, {
      ...fetchedResourceSettings,
      ...payload,
    });

    await this.resourceSettingsService.update(settings);
    return fetchedResource.id;
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

  /**
   * delete a resource manager
   * @param resourceId the target resource
   * @param managerId id of the manager
   */
  @log()
  public async deleteResourceManager(resourceId: number, managerId: number): Promise<number> {
    const fetchedResource = await this.dao.get(resourceId);
    if (!fetchedResource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', {
        variables: { resource: `${resourceId}` },
      });
    }
    const user = (await this.userService.get(managerId)) as User;
    const fetchedManager = (await this.memberService.getByCriteria(
      { organization: fetchedResource.organization, user },
      FETCH_STRATEGY.SINGLE,
    )) as Member;
    if (!fetchedManager) {
      throw new NotFoundError('USER.NON_EXISTANT {{user}}', {
        variables: { user: `${managerId}` },
      });
    }
    if (!fetchedResource.managers.isInitialized) await fetchedResource.managers.init();
    fetchedResource.managers.remove(fetchedManager);

    this.dao.update(fetchedResource);

    return fetchedResource.id;
  }

  /**
   * update a resource managers route
   * @param resourceId id of the target resource
   * @param managerId id of the added manager
   */
  @log()
  public async addResourceManager(resourceId: number, managerId: number): Promise<number> {
    const fetchedResource = await this.dao.get(resourceId);
    if (!fetchedResource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', {
        variables: { resource: `${resourceId}` },
      });
    }

    const user = (await this.userService.get(managerId)) as User;
    const fetchedManager = (await this.memberService.getByCriteria(
      { organization: fetchedResource.organization, user },
      FETCH_STRATEGY.SINGLE,
    )) as Member;
    if (!fetchedManager) {
      throw new NotFoundError('USER.NON_EXISTANT {{user}}', {
        variables: { user: `${managerId}` },
      });
    }

    if (!fetchedResource.managers.isInitialized) await fetchedResource.managers.init();
    fetchedResource.managers.add(fetchedManager);
    const updatedResourceResult = await this.dao.update(fetchedResource);

    return updatedResourceResult.id;
  }

  @log()
  public async getAllResourceManagers(resourceId: number): Promise<Member[]> {
    const fetchedResource = await this.dao.get(resourceId);

    if (!fetchedResource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT {{resource}}', {
        variables: { resource: `${resourceId}` },
      });
    }

    let managers: any[] = [];
    await fetchedResource.managers.init();
    managers = fetchedResource.managers.toArray();

    return managers;
  }

  @log()
  public async getLonabaleResources(): Promise<any> {
    return this.loanableResourceDao.getAll();
  }
}
