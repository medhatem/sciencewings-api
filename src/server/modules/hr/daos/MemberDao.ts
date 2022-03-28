import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Member } from '@/modules/hr/models/Member';

@provideSingleton()
export class MemberDao extends BaseDao<Member> {
  private constructor(public model: Member = Member.getInstance()) {
    super(model);
  }

  static getInstance(): MemberDao {
    return container.get(MemberDao);
  }
}
