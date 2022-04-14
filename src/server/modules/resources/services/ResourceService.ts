import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import { Result } from '@/utils/Result';
import { Resource } from '@/modules/resources/models/Resource';
import { ResourceDao } from '@/modules/resources/daos/ResourceDao';
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';
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

@provideSingleton(IResourceService)
export class ResourceService extends BaseService<Resource> {
  constructor(public dao: ResourceDao, public resourceService: IResourceService) {
    super(dao);
  }

  static getInstance(): IResourceService {
    return container.get(IResourceService);
  }

  @log()
  @safeGuard()
  public async getResourceSettings(resourceId: number): Promise<Result<any>> {
    const fetchedResource = await this.resourceService.get(resourceId);
    if (fetchedResource.isFailure || !fetchedResource.getValue()) {
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
    }

    return Result.ok(fetchedResource.getValue().settings);
  }

  @log()
  @safeGuard()
  @validate
  public async updateResourcesSettingsGeneralStatus(
    @validateParam(ResourceGeneralStatusSchema) payload: ResourceSettingsGeneralStatusRO,
    resourceId: number,
  ): Promise<Result<number>> {
    const fetchedResource = await this.resourceService.get(resourceId);
    if (!fetchedResource) {
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
    }
    const resourceValue = fetchedResource.getValue();

    const resource = this.resourceService.wrapEntity(
      resourceValue,
      {
        ...resourceValue,
        settings: { ...resourceValue.settings, ...payload },
      },
      false,
    );

    const updatedResource = await this.resourceService.update(resource);
    return Result.ok<number>(updatedResource.getValue().id);
  }

  @log()
  @safeGuard()
  @validate
  public async updateResourcesSettingsGeneralVisibility(
    @validateParam(ResourceGeneralVisibilitySchema) payload: ResourceSettingsGeneralVisibilityRO,
    resourceId: number,
  ): Promise<Result<number>> {
    const fetchedResource = await this.resourceService.get(resourceId);
    if (!fetchedResource) {
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
    }
    const resourceValue = fetchedResource.getValue();

    const resource = this.resourceService.wrapEntity(
      resourceValue,
      {
        ...resourceValue,
        settings: { ...resourceValue.settings, ...payload },
      },
      false,
    );

    const updatedResource = await this.resourceService.update(resource);
    return Result.ok<number>(updatedResource.getValue().id);
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
    const fetchedResource = await this.resourceService.get(resourceId);
    if (!fetchedResource) {
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
    }

    const resourceValue = fetchedResource.getValue();

    const resource = this.resourceService.wrapEntity(
      resourceValue,
      {
        ...resourceValue,
        settings: { ...resourceValue.settings, ...payload },
      },
      false,
    );

    const updatedResource = await this.resourceService.update(resource);
    return Result.ok<number>(updatedResource.getValue().id);
  }
}
