import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Path, Security, GET, PathParam, PUT } from 'typescript-rest';
import {
  ResourceSettingsGeneralVisibilityRO,
  ResourceSettingsGeneralPropertiesRO,
  ResourceSettingsGeneralStatusRO,
} from './RequestObject';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Response } from 'typescript-rest-swagger';
import {
  ResourceDTO,
  UpdateResourceBodyDTO,
  UpdateResourceDTO,
  GetResourceSettingsBodyDTO,
  GetResourceSettingsDTO,
} from '@/modules/resources/dtos/ResourceDTO';
import { BaseErrorDTO } from '@/modules/base/dtos/BaseDTO';
import { Resource } from '@/modules/resources/models/Resource';
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';

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
   * Update a resource settings, section general status
   *
   * @param payload
   * Should contain Resource Settings for the section general status
   * @param id
   * id of the requested resource
   */
  @PUT
  @Path('settings/general/status/:resourceId')
  @Security()
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Resource reservation general settings updated Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
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
   * Update a resource settings, section general visibility
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
   * Update a resource settings, section general general
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
   * Get a resource settings
   *
   * @param id
   * id of the requested resource
   */
  @GET
  @Path('settings/:resourceId')
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
