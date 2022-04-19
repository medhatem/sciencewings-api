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
  ResourceReservationGeneralSchema,
  ResourceReservationUnitSchema,
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

@provideSingleton(IResourceService)
export class ResourceService extends BaseService<Resource> {
  constructor(public dao: ResourceDao, private resourceRateService: IResourceRateService) {
    super(dao);
  }

  static getInstance(): IResourceService {
    return container.get(IResourceService);
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
    @validateParam(ResourceReservationUnitSchema) payload: ResourceReservationVisibilityRO,
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
