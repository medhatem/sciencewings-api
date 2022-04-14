import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import { Resource } from '@/modules/resources/models/Resource';
import { ResourceDao } from '@/modules/resources/daos/ResourceDao';
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';
import { safeGuard } from '@/decorators/safeGuard';
import { log } from '@/decorators/log';
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
import { ResourceRate } from '@/modules/resources';
import { validate } from '@/decorators/validate';
import { validateParam } from '@/decorators/validateParam';
import { IResourceRateService } from '../interfaces';

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
  public async getResourceReservationGeneral(resourceId: number): Promise<Result<any>> {
    const fetchedResource = await this.dao.repository
      .createQueryBuilder()
      .select([
        'isEnabled',
        'isLoanable',
        'isReturnTheirOwnLoans',
        'isReservingLoansAtFutureDates',
        'overdueNoticeDelay',
        'recurringReservations',
      ])
      .execute('get', true);
    if (!fetchedResource) {
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
    }

    return Result.ok(fetchedResource);
  }
  @log()
  @safeGuard()
  public async getResourceReservationUnites(resourceId: number): Promise<Result<any>> {
    const fetchedResource = await this.dao.repository
      .createQueryBuilder()
      .select(['unitName', 'unitLimit', 'unites'])
      .execute('get', true);
    if (!fetchedResource) {
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
    }
    return Result.ok(fetchedResource);
  }
  @log()
  @safeGuard()
  public async getResourceReservationTimerRestriction(resourceId: number): Promise<Result<any>> {
    const fetchedResource = await this.dao.repository
      .createQueryBuilder()
      .select([
        'isEditingWindowForUsers',
        'isRestrictCreatingNewReservationBeforeTime',
        'isRestrictCreatingNewReservationAfterTime',
        'reservationTimeGranularity',
        'isAllowUsersToEndReservationEarly',
        'defaultReservationDuration',
        'reservationDurationMinimum',
        'reservationDurationMaximum',
        'bufferTimeBeforeReservation',
      ])
      .execute('get', true);
    if (!fetchedResource) {
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
    }
    return Result.ok(fetchedResource);
  }

  @log()
  @safeGuard()
  public async getResourceReservationVisibility(resourceId: number): Promise<Result<any>> {
    const fetchedResource = await this.dao.repository
      .createQueryBuilder()
      .select(['isReservationDetailsVisibilityToNonModerators'])
      .execute('get', true);
    if (!fetchedResource) {
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
    }
    return Result.ok(fetchedResource);
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
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
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

    return Result.ok<number>(1);
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
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
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

    return Result.ok<number>(1);
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
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
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
    return Result.ok<number>(1);
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
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
    }
    resource = fetchedResource.getValue();

    const createdResourceRateResult = await this.resourceRateService.create({
      ...payload,
      resource,
    });
    if (createdResourceRateResult.isFailure) {
      return Result.fail<number>(createdResourceRateResult.error);
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
      return Result.fail<number>(`Resource Rate with id ${resourceRateId} does not exist.`);
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
      return Result.fail<number>(updatedResourceRateResult.error);
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
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
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
  public async getResourceSettings(resourceId: number): Promise<Result<any>> {
    const fetchedResource = await this.get(resourceId);
    if (fetchedResource.isFailure || !fetchedResource.getValue()) {
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
    }

    return Result.ok(fetchedResource.getValue().settings);
  }
}
