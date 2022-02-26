import { Group, GroupDAO, IGroupService } from '..';
import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';

@provideSingleton(IGroupService)
export class GroupService extends BaseService<Group> implements IGroupService {
  constructor(public dao: GroupDAO) {
    super(dao);
  }

  static getInstance(): IGroupService {
    return container.get(IGroupService);
  }
}
