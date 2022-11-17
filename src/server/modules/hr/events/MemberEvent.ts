import { MemberTypeEnum, MembershipStatus } from '@/modules/hr/models/Member';
import { User, userStatus } from '@/modules/users/models/User';

import { MemberService } from '@/modules/hr/services/MemberService';
import { Organization } from '@/modules/organizations/models/Organization';
import { on } from '@/decorators/events';

export class MemberEvent {
  @on('create-member')
  async createMember(user: User, organization: Organization) {
    const memberService = MemberService.getInstance();
    return await memberService.create({
      name: user.firstname + ' ' + user.lastname,
      user,
      active: true,
      organization,
      roles: MemberTypeEnum.ADMIN,
      membership: MembershipStatus.ACCEPTED,
      status: userStatus.ACTIVE,
      joinDate: new Date(),
      workEmail: user.email,
    });
  }
  @on('delete-member')
  async deleteMember(payload: { [key: string]: any }) {
    const memberService = MemberService.getInstance();
    return await memberService.removeWithCriteria(payload);
  }
}
