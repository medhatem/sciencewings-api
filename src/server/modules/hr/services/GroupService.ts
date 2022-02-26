import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { Group } from '@/modules/hr/models';
import { GroupDAO } from '@/modules/hr/daos';
import { IGroupService } from '@/modules/hr/interfaces';

@provideSingleton(IGroupService)
export class GroupService extends BaseService<Group> implements IGroupService {
  constructor(public dao: GroupDAO) {
    super(dao);
  }

  static getInstance(): IGroupService {
    return container.get(IGroupService);
  }
}
