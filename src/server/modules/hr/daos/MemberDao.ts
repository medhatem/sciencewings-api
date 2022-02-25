import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '../../base/daos/BaseDao';
import { Member } from '../../hr/models/Member';

@provideSingleton()
export class MemberDao extends BaseDao<Member> {
  private constructor(public model: Member) {
    super(model);
  }

  static getInstance(): MemberDao {
    return container.get(MemberDao);
  }
}
