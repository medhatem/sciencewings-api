import { container, provideSingleton } from '@/di';
import { BaseService } from '@/modules/base/services/BaseService';
import { IResourceTagService } from '@/modules/resources/interfaces/IResourceTagService';
import { ResourceTag } from '@/modules/resources/models/ResourceTag';
import { ResourceTagDao } from '@/modules/resources/daos/ResourceTagDAO';

@provideSingleton(IResourceTagService)
export class ResourceTagService extends BaseService<ResourceTag> {
  constructor(public dao: ResourceTagDao) {
    super(dao);
  }

  static getInstance(): IResourceTagService {
    return container.get(IResourceTagService);
  }
}
