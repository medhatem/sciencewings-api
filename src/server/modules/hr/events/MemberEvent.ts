import { MemberService } from '@/modules/hr/services/MemberService';
import { on } from '@/decorators/events';
import { Organization } from '@/modules/organizations/models/Organization';
import { User, userStatus } from '@/modules/users/models/User';
import { Member, MemberTypeEnum } from '../models';

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
      status: userStatus.INVITATION_PENDING,
      joinDate: new Date(),
      workEmail: user.email,
    } as Member);
  }
}
