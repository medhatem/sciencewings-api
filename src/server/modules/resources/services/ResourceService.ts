import { UserService } from './../../users/services/UserService';
import { Result } from '@utils/Result';
import { container, provideSingleton } from '@di/index';

import { BaseService } from '@modules/base/services/BaseService';
import { Resource } from '@modules/resources/models/Resource';
import { ResourceDao } from '../daos/ResourceDao';
import { CreateResourceRO } from '../routes/RequestObject';
import { safeGuard } from 'server/decorators/safeGuard';
import { log } from 'server/decorators/log';

@provideSingleton()
export class ResourceService extends BaseService<Resource> {
  constructor(public dao: ResourceDao, public userService: UserService) {
    super(dao);
  }

  static getInstance(): ResourceService {
    return container.get(ResourceService);
  }

  @log()
  @safeGuard()
  public async createResource(payload: CreateResourceRO, userId: number): Promise<Result<number>> {
    const user = await this.userService.get(userId);

    if (!user) {
      return Result.fail<number>(`User with id ${userId} dose not exists.`);
    }

    const resource = this.wrapEntity(this.dao.model, payload);
    const createdResource = await this.create(resource);
    return Result.ok<number>(createdResource.id);
  }
}
