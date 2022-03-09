import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { Member } from '@/modules/hr/models/Member';
import { MemberDao } from '@/modules/hr/daos/MemberDao';

@provideSingleton(IMemberService)
export class MemberService extends BaseService<Member> implements IMemberService {
  constructor(public dao: MemberDao) {
    super(dao);
  }

  static getInstance(): IMemberService {
    return container.get(IMemberService);
  }
}
