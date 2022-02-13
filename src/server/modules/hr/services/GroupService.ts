import { container, provideSingleton } from '@di/index';
import { BaseService } from '../../base/services/BaseService';
import { Group, GroupDAO, IGroupService } from '..';

@provideSingleton(IGroupService)
export class GroupService extends BaseService<Group> implements IGroupService {
  constructor(public dao: GroupDAO) {
    super(dao);
  }

  static getInstance(): IGroupService {
    return container.get(IGroupService);
  }
}
