import { container, lazyInject, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Path, POST, Security, GET, PathParam, PUT, ContextRequest, QueryParam, DELETE } from 'typescript-rest';
import {
  ResourceSettingsGeneralVisibilityRO,
  ResourceSettingsGeneralPropertiesRO,
  ResourceSettingsGeneralStatusRO,
  ResourceRO,
  UpdateResourceRO,
} from './RequestObject';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Response } from 'typescript-rest-swagger';
import {
  CreateResourceDTO,
  ResourcesGetDTO,
  UpdateResourceBodyDTO,
  UpdateResourceDTO,
  CreatedResourceBodyDTO,
  GetResourcesBodyDTO,
  ResourceGetDTO,
} from '@/modules/resources/dtos/ResourceDTO';
import {
  GetResourceSettingsBodyDTO,
  GetResourceSettingsDTO,
  resourceManagersRequestDTO,
} from '@/modules/resources/dtos/ResourceSettingsDTO';
import { Resource } from '@/modules/resources/models/Resource';
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';
import {
  ResourcesSettingsReservationGeneralRO,
  ResourceRateRO,
  ResourceTimerRestrictionRO,
  ResourcesSettingsReservationUnitRO,
  ResourceReservationVisibilityRO,
} from './RequestObject';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { GetResourceRateDTO, ResourceRateBodyDTO } from '@/modules/resources/dtos/ResourceRateDTO';
import { UserRequest } from '@/types/UserRequest';
import { IReservationService } from '@/modules/reservation/interfaces/IReservationService';

@provideSingleton()
@Path('resources')
export class ResourceRoutes extends BaseRoutes<Resource> {
  @lazyInject(IReservationService) private reservationResourceService: IReservationService;

  constructor(private ResourceService: IResourceService) {
    super(ResourceService as any, new ResourcesGetDTO(), new UpdateResourceDTO());
  }

  static getInstance(): ResourceRoutes {
    return container.get(ResourceRoutes);
  }

  /**
   * Registers a new resource in the database
   *
   * @param payload
   * Should contain Resource data that include Resource data
   */
  @POST
  @Path('create')
  @Security(['{orgId}-create-resource'])
  @LoggerStorage()
  @Response<CreatedResourceBodyDTO>(201, 'Resource created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async createResource(@ContextRequest request: UserRequest, payload: ResourceRO): Promise<CreateResourceDTO> {
    const result = await this.ResourceService.createResource(request.userId, payload);
    return new CreateResourceDTO({ body: { id: result, statusCode: 201 } });
  }

  /**
   * Update a resource in the database
   *
   * @param payload
   * Should contain Resource data that include Resource data with its id
   * @param id
   * id of the requested resource
   */
  @PUT
  @Path('update/:id')
  @Security(['{orgId}-update-resource'])
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Resource updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateResource(payload: UpdateResourceRO, @PathParam('id') id: number): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.updateResource(payload, id);
    return new UpdateResourceDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * get one resource by id
   * @param resourceId resource id
   */
  @GET
  @Path('/getResourceById/:resourceId')
  @Security()
  @LoggerStorage()
  @Response<ResourceGetDTO>(200, 'Resource Retrived Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getResourceById(@PathParam('resourceId') resourceId: number): Promise<ResourceGetDTO> {
    const result = await this.ResourceService.getResourceById(resourceId);

    return new ResourceGetDTO({ body: result, statusCode: 200 });
  }

  /**
   * retrieve all resources of a given organization by id
   *
   * @param organizationId organization id
   * @param page displayed page
   * @param size number of item to display in one page
   * @param query of type string used to do the search
   */
  @GET
  @Path('getOrganizationResourcesById/:organizationId')
  @Security(['{orgId}-view-organization-resources', '{orgId}-admin'])
  @LoggerStorage()
  @Response<GetResourcesBodyDTO>(200, 'Resource Retrived Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getOrganizationResources(
    @PathParam('organizationId') organizationId: number,
    @QueryParam('page') page?: number,
    @QueryParam('size') size?: number,
    @QueryParam('query') query?: string,
  ): Promise<ResourcesGetDTO> {
    const result = await this.ResourceService.getResourcesOfAGivenOrganizationById(
      organizationId,
      page || null,
      size || null,
      query || null,
    );
    if (result?.pagination)
      return new ResourcesGetDTO({
        body: { data: result.data, pagination: result.pagination, statusCode: 200 },
      });
    else
      return new ResourcesGetDTO({
        body: { data: result.data, statusCode: 200 },
      });
  }
  /**
   * get loanable resources by id
   */
  @GET
  @Path('/getAllLoanableResources')
  @Security()
  @LoggerStorage()
  @Response<ResourcesGetDTO>(200, 'Loanable resource Retrived Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getAllLoanableResources(
    @QueryParam('category') category?: string,
    @QueryParam('query') query?: string,
  ): Promise<ResourcesGetDTO> {
    const result = await this.ResourceService.getAllLoanableResources(category || null, query || null);

    return new ResourcesGetDTO({
      body: { data: result, statusCode: 200 },
    });
  }

  /**
   * Update a resource settings, section reservation general
   *
   * @param payload
   * Should container resource settings data
   * @param resourceId
   * Requested resource id
   */
  @PUT
  @Path('settings/reservation/general/:resourceId')
  @Security(['{orgId}-update-resource-settings', '{orgId}-admin'])
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Resource reservation general settings updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateResourcesSettingsReservationGeneral(
    payload: ResourcesSettingsReservationGeneralRO,
    @PathParam('resourceId') resourceId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.updateResourceReservationGeneral(payload, resourceId);

    return new UpdateResourceDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * Update a resource settings, section general status
   *
   * @param payload
   * Should container resource settings data
   * @param resourceId
   * Requested resource id
   */
  @PUT
  @Path('settings/general/status/:resourceId')
  @Security(['{orgId}-update-resource-settings', '{orgId}-admin'])
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Resource reservation general settings updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateResourcesSettingsGeneralStatus(
    payload: ResourceSettingsGeneralStatusRO,
    @PathParam('resourceId') resourceId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.updateResourcesSettingsGeneralStatus(payload, resourceId);

    return new UpdateResourceDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * Update a resource settings, section reservation units
   *
   * @param payload
   * Should container resource settings data
   * @param resourceId
   * Requested resource id
   */
  @PUT
  @Path('settings/reservation/unit/:resourceId')
  @Security(['{orgId}-update-resource-settings', '{orgId}-admin'])
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Resource reservation unit settings updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateResourcesSettingsReservationUnit(
    payload: ResourcesSettingsReservationUnitRO,
    @PathParam('resourceId') resourceId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.updateResourceReservationUnits(payload, resourceId);

    return new UpdateResourceDTO({ body: { id: result, statusCode: 204 } });
  }

  /* Update a resource settings, section general visibility
   *
   * @param payload
   * Should contain Resource Settings for the section general visibility
   * @param id
   * id of the requested resource
   */
  @PUT
  @Path('settings/general/visibility/:resourceId')
  @Security(['{orgId}-update-resource-settings', '{orgId}-admin'])
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Resource reservation general settings updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateResourcesSettingsGeneralVisibility(
    payload: ResourceSettingsGeneralVisibilityRO,
    @PathParam('resourceId') resourceId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.updateResourcesSettingsGeneralVisibility(payload, resourceId);

    return new UpdateResourceDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * get resource reservation rate
   *
   * @param resourceId
   * Requested resource id
   */
  @GET
  @Path('settings/reservation/rate/:resourceId')
  @Security(['{orgId}-view-resource-settings', '{orgId}-admin'])
  @Response<ResourceRateBodyDTO>(201, 'Resource created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  @LoggerStorage()
  public async getResourceRate(@PathParam('resourceId') resourceId: number): Promise<GetResourceRateDTO> {
    const result = await this.ResourceService.getResourceRate(resourceId);

    return new GetResourceRateDTO({ body: { data: result, statusCode: 200 } });
  }

  /**
   * Create a reservation rate
   *
   * @param payload
   * Should container resource settings data
   * @param resourceId
   * Requested resource id
   */
  @POST
  @Path('settings/reservation/rate/:resourceId')
  @Security(['{orgId}-create-resource-reservation-rate', '{orgId}-admin'])
  @Response<CreateResourceDTO>(201, 'Resource created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  @LoggerStorage()
  public async createResourceRate(
    payload: ResourceRateRO,
    @PathParam('resourceId') resourceId: number,
  ): Promise<CreateResourceDTO> {
    const result = await this.ResourceService.createResourceRate(payload, resourceId);

    return new CreateResourceDTO({ body: { id: result, statusCode: 201 } });
  }

  /**
   * update reservation rate
   *
   * @param payload
   * Should container resource settings data
   * @param resourceId
   * Requested resrvation rate id
   */
  @PUT
  @Path('settings/reservation/rate/:resourceRateId')
  @Security(['{orgId}-update-resource-reservation', '{orgId}-admin'])
  @Response<UpdateResourceBodyDTO>(204, 'Resource created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  @LoggerStorage()
  public async updateResourceRate(
    payload: ResourceRateRO,
    @PathParam('resourceRateId') resourceRateId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.updateResourceRate(payload, resourceRateId);

    return new UpdateResourceDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * Update a resource settings, section reservation time restriction
   *
   * @param payload
   * Should container resource settings data
   * @param resourceId
   * Requested resource id
   */
  @PUT
  @Path('settings/reservation/time_restriction/:resourceId')
  @Security(['{orgId}-update-resource-reservation', '{orgId}-admin'])
  @Response<UpdateResourceBodyDTO>(204, 'Resource created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  @LoggerStorage()
  public async updateResourceTimerRestriction(
    payload: ResourceTimerRestrictionRO,
    @PathParam('resourceId') resourceId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.updateResourceReservationTimerRestriction(payload, resourceId);

    return new UpdateResourceDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * Update a resource settings, section reservation time restriction
   *
   * @param payload
   * Should container resource settings data
   * @param resourceId
   * Requested resource id
   */
  @PUT
  @Path('settings/reservation/visibility/:resourceId')
  @Security(['{orgId}-update-resource-reservation', '{orgId}-admin'])
  @Response<UpdateResourceBodyDTO>(204, 'Resource created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  @LoggerStorage()
  public async updateResourceRestrictionVisibility(
    payload: ResourceReservationVisibilityRO,
    @PathParam('resourceId') resourceId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.updateResourceReservationVisibility(payload, resourceId);

    return new UpdateResourceDTO({ body: { id: result, statusCode: 204 } });
  }

  /* Update a resource settings, section general general
   *
   * @param payload
   * Should contain Resource Settings for the section general general
   * @param id
   * id of the requested resource
   */
  @PUT
  @Path('settings/general/properties/:resourceId')
  @Security(['{orgId}-update-resource-properties', '{orgId}-admin'])
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Resource reservation general settings updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateResourcesSettingsnGeneralProperties(
    payload: ResourceSettingsGeneralPropertiesRO,
    @PathParam('resourceId') resourceId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.updateResourcesSettingsnGeneralProperties(payload, resourceId);

    return new UpdateResourceDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * Get a resource settings in the database
   *
   * @param resourceId
   * Requested resource id
   */
  @GET
  @Path('settings/:resourceId')
  @Security(['{orgId}-view-resource-settings', '{orgId}-admin'])
  @LoggerStorage()
  @Response<GetResourceSettingsBodyDTO>(204, 'Resource reservation general settings updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getResourceSettings(@PathParam('resourceId') resourceId: number): Promise<GetResourceSettingsDTO> {
    const result = await this.ResourceService.getResourceSettings(resourceId);

    return new GetResourceSettingsDTO({ body: { ...result, statusCode: 200 } });
  }
  /**
   * Get a resource settings in the database
   *
   * @param resourceId
   * Requested resource id
   */
  @GET
  @Path('getEventsByRange/:resourceId')
  @Security(['{orgId}-view-resource-EventsByRange', '{orgId}-admin'])
  @LoggerStorage()
  @Response<GetResourceSettingsBodyDTO>(204, 'Resource reservation general settings updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getEventsByRange(
    @PathParam('resourceId') resourceId: number,
    @QueryParam('start') start: string,
    @QueryParam('end') end: string,
  ): Promise<any> {
    const result = await this.reservationResourceService.getEventsByRange(resourceId, new Date(start), new Date(end));

    return { result };
  }

  /**
   * Get a resource settings in the database
   *
   * @param resourceId
   * Requested resource id
   */
  @POST
  @Path('createReservation/:resourceId')
  @Security(['{orgId}-create-resource-reservation', '{orgId}-admin'])
  @LoggerStorage()
  @Response<GetResourceSettingsBodyDTO>(204, 'Resource reservation general settings updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async createReservation(@PathParam('resourceId') resourceId: number, payload: any): Promise<any> {
    const result = await this.reservationResourceService.createReservation(resourceId, payload);

    return { result };
  }

  /**
   * delete a resource manager
   * @param resourceId the target resource
   * @param managerId id of the manager
   */
  @DELETE
  @Path(':resourceId/managers/:managerId')
  @Security(['{orgId}-delete-resource-manager', '{orgId}-admin'])
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'resource updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async deleteResourceManager(
    @PathParam('resourceId') resourceId: number,
    @PathParam('managerId') managerId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.deleteResourceManager(resourceId, managerId);

    return new UpdateResourceDTO({ body: { id: result, statusCode: 204 } });
  }
  /**
   * update a resource managers
   * @param resourceId id of the target resource
   * @param managerId id of the added manager
   */
  @PUT
  @Path(':resourceId/managers/:managerId')
  @Security(['{orgId}-update-resource-managers', '{orgId}-admin'])
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'resource updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async addResourceManager(
    @PathParam('resourceId') resourceId: number,
    @PathParam('managerId') managerId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.addResourceManager(resourceId, managerId);

    return new UpdateResourceDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * get all managers of a given resource
   * @param resourceId: resource id
   */
  @GET
  @Path('/:resourceId/managers')
  @Security()
  @LoggerStorage()
  @Response<resourceManagersRequestDTO>(200, 'Return infrastructure resources ')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getAllRessourcesOfAgivenInfrastructure(
    @PathParam('resourceId') resourceId: number,
  ): Promise<resourceManagersRequestDTO> {
    const result = await this.ResourceService.getAllResourceManagers(resourceId);

    return new resourceManagersRequestDTO({ body: { data: result, statusCode: 200 } });
  }
}
