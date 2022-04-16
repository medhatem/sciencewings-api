import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Path, POST, Security, GET, PathParam, PUT } from 'typescript-rest';
import {
  ResourceSettingsGeneralVisibilityRO,
  ResourceSettingsGeneralPropertiesRO,
  ResourceSettingsGeneralStatusRO,
} from './RequestObject';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Response } from 'typescript-rest-swagger';
import {
  CreateResourceDTO,
  ResourceDTO,
  UpdateResourceBodyDTO,
  UpdateResourceDTO,
  GetResourceSettingsBodyDTO,
  GetResourceSettingsDTO,
} from '@/modules/resources/dtos/ResourceDTO';
import { BaseErrorDTO } from '@/modules/base/dtos/BaseDTO';
import { Resource } from '@/modules/resources/models/Resource';
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';
import {
  ResourcesSettingsReservationGeneralRO,
  ResourceRateRO,
  ResourceTimerRestrictionRO,
  ResourcesSettingsReservationUnitRO,
  ResourceReservationVisibilityRO,
} from './RequestObject';

@provideSingleton()
@Path('resources')
export class ResourceRoutes extends BaseRoutes<Resource> {
  constructor(private ResourceService: IResourceService) {
    super(ResourceService as any, new ResourceDTO(), new UpdateResourceDTO());
  }

  static getInstance(): ResourceRoutes {
    return container.get(ResourceRoutes);
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
  @Path('/settings/reservation/general/:resourceId')
  @Security()
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Resource reservation general settings updated Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async updateResourcesSettingsReservationGeneral(
    payload: ResourcesSettingsReservationGeneralRO,
    @PathParam('resourceId') resourceId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.updateResourceReservationGeneral(payload, resourceId);
    if (result.isFailure) {
      return new UpdateResourceDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new UpdateResourceDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  public async updateResourcesSettingsGeneralStatus(
    payload: ResourceSettingsGeneralStatusRO,
    @PathParam('resourceId') resourceId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.updateResourcesSettingsGeneralStatus(payload, resourceId);

    if (result.isFailure) {
      return new UpdateResourceDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new UpdateResourceDTO({ body: { id: result.getValue(), statusCode: 204 } });
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
  @Path('/settings/reservation/unit/:resourceId')
  @Security()
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Resource reservation unit settings updated Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async updateResourcesSettingsReservationUnit(
    payload: ResourcesSettingsReservationUnitRO,
    @PathParam('resourceId') resourceId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.updateResourceReservationUnits(payload, resourceId);
    if (result.isFailure) {
      return new UpdateResourceDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new UpdateResourceDTO({ body: { id: result.getValue(), statusCode: 204 } });
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
  @Security()
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Resource reservation general settings updated Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async updateResourcesSettingsGeneralVisibility(
    payload: ResourceSettingsGeneralVisibilityRO,
    @PathParam('resourceId') resourceId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.updateResourcesSettingsGeneralVisibility(payload, resourceId);

    if (result.isFailure) {
      return new UpdateResourceDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new UpdateResourceDTO({ body: { id: result.getValue(), statusCode: 204 } });
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
  @Path('resources/settings/reservation/rate/:resourceId')
  @Security()
  @Response<CreateResourceDTO>(201, 'Resource created Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  @LoggerStorage()
  public async createResourceRate(
    payload: ResourceRateRO,
    @PathParam('resourceId') resourceId: number,
  ): Promise<CreateResourceDTO> {
    const result = await this.ResourceService.createResourceRate(payload, resourceId);

    if (result.isFailure) {
      return new CreateResourceDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreateResourceDTO({ body: { id: result.getValue(), statusCode: 201 } });
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
  @Path('resources/settings/reservation/rate/:resourceRateId')
  @Security()
  @Response<UpdateResourceBodyDTO>(204, 'Resource created Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  @LoggerStorage()
  public async updateResourceRate(
    payload: ResourceRateRO,
    @PathParam('resourceRateId') resourceRateId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.updateResourceRate(payload, resourceRateId);

    if (result.isFailure) {
      return new UpdateResourceDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new UpdateResourceDTO({ body: { id: result.getValue(), statusCode: 204 } });
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
  @Path('resources/settings/reservation/time_restriction/:resourceId')
  @Security()
  @Response<UpdateResourceBodyDTO>(204, 'Resource created Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  @LoggerStorage()
  public async updateResourceTimerRestriction(
    payload: ResourceTimerRestrictionRO,
    @PathParam('resourceId') resourceId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.updateResourceReservationTimerRestriction(payload, resourceId);

    if (result.isFailure) {
      return new UpdateResourceDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new UpdateResourceDTO({ body: { id: result.getValue(), statusCode: 204 } });
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
  @Path('resources/settings/reservation/visibility/:resourceId')
  @Security()
  @Response<UpdateResourceBodyDTO>(204, 'Resource created Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  @LoggerStorage()
  public async updateResourceRestrictionVisibility(
    payload: ResourceReservationVisibilityRO,
    @PathParam('resourceId') resourceId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.updateResourceReservationVisibility(payload, resourceId);

    if (result.isFailure) {
      return new UpdateResourceDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new UpdateResourceDTO({ body: { id: result.getValue(), statusCode: 204 } });
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
  @Security()
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Resource reservation general settings updated Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async updateResourcesSettingsnGeneralProperties(
    payload: ResourceSettingsGeneralPropertiesRO,
    @PathParam('resourceId') resourceId: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.ResourceService.updateResourcesSettingsnGeneralProperties(payload, resourceId);

    if (result.isFailure) {
      return new UpdateResourceDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new UpdateResourceDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  /**
   * Get a resource settings in the database
   *
   * @param resourceId
   * Requested resource id
   */
  @GET
  @Path('/settings/:resourceId')
  @Security()
  @LoggerStorage()
  @Response<GetResourceSettingsBodyDTO>(204, 'Resource reservation general settings updated Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async getResourceSettings(@PathParam('resourceId') resourceId: number): Promise<GetResourceSettingsDTO> {
    const result = await this.ResourceService.getResourceSettings(resourceId);

    if (result.isFailure) {
      return new GetResourceSettingsDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }
    return new GetResourceSettingsDTO({ body: { ...result.getValue(), statusCode: 200 } });
  }
}
