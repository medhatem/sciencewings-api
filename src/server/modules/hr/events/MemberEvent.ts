import { MemberService } from '@/modules/hr/services/MemberService';
import { on } from '@/decorators/events';
import { Organization } from '@/modules/organizations/models/Organization';
import { User } from '@/modules/users/models/User';
import { MembershipStatus, MemberTypeEnum } from '@/modules/hr//models/Member';

export class MemberEvent {
  @on('create-member')
  async createMember(user: User, organization: Organization) {
    const memberService = MemberService.getInstance();
    await memberService.create({
      name: user.firstname + ' ' + user.lastname,
      user,
      active: true,
      organization,
      memberType: MemberTypeEnum.Regular,
      membership: MembershipStatus.ACCEPTED,
    });
  }
}
