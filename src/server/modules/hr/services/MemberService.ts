import { container, provideSingleton } from '@di/index';

import { BaseService } from '@modules/base/services/BaseService';
import { Member } from '@modules/hr/models/Member';
import { MemberDao } from '../daos/MemberDao';

@provideSingleton()
export class MemberService extends BaseService<Member> {
  constructor(public dao: MemberDao) {
    super(dao);
  }

  static getInstance(): MemberService {
    return container.get(MemberService);
  }
}
