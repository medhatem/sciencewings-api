import { container, provideSingleton } from '@di/index';

import { BaseService } from '@modules/base/services/BaseService';
import { Resource } from '@modules/resources/models/Resource';
import { ResourceDao } from '../daos/ResourceDao';

@provideSingleton()
export class ResourceService extends BaseService<Resource> {
  constructor(public dao: ResourceDao) {
    super(dao);
  }

  static getInstance(): ResourceService {
    return container.get(ResourceService);
  }
}
