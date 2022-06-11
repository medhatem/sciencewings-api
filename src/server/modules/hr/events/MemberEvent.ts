import { MemberService } from '@/modules/hr/services/MemberService';
import { on } from '@/decorators/events';
import { Organization } from '@/modules/organizations/models/Organization';
import { User, userStatus } from '@/modules/users/models/User';

export class MemberEvent {
  @on('create-member')
  async createMember(user: User, organization: Organization) {
    const memberService = MemberService.getInstance();
    await memberService.create({
      name: user.firstname + ' ' + user.lastname,
      user,
      active: true,
      organization,
      memberType: userStatus.ACTIVE,
    });
  }
}
