import { MemberService } from '@/modules/hr/services/MemberService';
import { on } from '@/decorators/events';
import { Organization } from '@/modules/organizations/models/Organization';
import { User, userStatus } from '@/modules/users/models/User';
import { MembershipStatus, MemberTypeEnum } from '@/modules/hr/models/Member';

export class MemberEvent {
  @on('create-member')
  async createMember(user: User, organization: Organization) {
    const memberService = MemberService.getInstance();
    return await memberService.create({
      name: user.firstname + ' ' + user.lastname,
      user,
      active: true,
      organization,
      memberType: MemberTypeEnum.ADMIN,
      membership: MembershipStatus.ACCEPTED,
      status: userStatus.ACTIVE,
      joinDate: new Date(),
      workEmail: user.email,
    });
  }
}
