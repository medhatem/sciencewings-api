import { MemberService } from '@/modules/hr/services/MemberService';
import { on } from '@/decorators/events';
import { Organization } from '@/modules/organizations/models/Organization';
import { User, userStatus } from '@/modules/users/models/User';
import { Member } from '../models';

export class MemberEvent {
  @on('create-member')
  async createMember(user: User, organization: Organization) {
    const memberService = MemberService.getInstance();
    return await memberService.create({
      name: user.firstname + ' ' + user.lastname,
      user,
      active: true,
      organization,
      memberType: 'ADMIN',
      status: userStatus.ACTIVE,
      joinDate: new Date(),
    } as Member);
  }
}
