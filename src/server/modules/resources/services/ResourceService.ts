import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import { Resource } from '@/modules/resources/models/Resource';
import { ResourceDao } from '@/modules/resources/daos/ResourceDao';
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';
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
  public async getResourcesSettingsGeneralStatus(resourceId: number): Promise<Result<any>> {
    const fetchedResource = await this.dao.repository
      .createQueryBuilder()
      .select(['statusType', 'statusDescription'])
      .execute('get', true);
    if (!fetchedResource) {
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
    }
    return Result.ok(fetchedResource);
  }

  @log()
  @safeGuard()
  public async getResourceSettingsGeneralVisbility(resourceId: number): Promise<Result<any>> {
    const fetchedResource = await this.dao.repository
      .createQueryBuilder()
      .select([
        'visibility',
        'isUnlistedOnOrganizationPage',
        'isUnlistedToUsersWhoCannotReserve',
        'isFullyHiddentoUsersWhoCannotReserve',
        'isPromotedOnSitePageAsALargeButtonAboveOtherResources',
        'isHideAvailabilityonSitePage',
      ])
      .execute('get', true);
    if (!fetchedResource) {
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
    }
    return Result.ok(fetchedResource);
  }

  @log()
  @safeGuard()
  public async getResourceSettingsGeneralProperties(resourceId: number): Promise<Result<any>> {
    const fetchedResource = await this.dao.repository
      .createQueryBuilder()
      .select(['accessToResource'])
      .execute('get', true);
    if (!fetchedResource) {
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
    }
    return Result.ok(fetchedResource);
  }
}
