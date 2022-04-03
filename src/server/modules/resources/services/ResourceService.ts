import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import { Resource } from '@/modules/resources/models/Resource';
import { ResourceDao } from '@/modules/resources/daos/ResourceDao';
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';
import { safeGuard } from '@/decorators/safeGuard';
import { log } from '@/decorators/log';
import { Result } from '@/utils/Result';

@provideSingleton(IResourceService)
export class ResourceService extends BaseService<Resource> {
  constructor(public dao: ResourceDao) {
    super(dao);
  }

  static getInstance(): IResourceService {
    return container.get(IResourceService);
  }

  @log()
  @safeGuard()
  public async getResourceSettingsReservationGeneral(resourceId: number): Promise<Result<any>> {
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
  public async getResourceUnites(resourceId: number): Promise<Result<any>> {
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
  public async getResourceTimerRestriction(resourceId: number): Promise<Result<any>> {
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
}
