import { EventEmitter } from 'events';
import { MemberStatusType } from '@/modules/hr/models/Member';
import { MemberService } from '@/modules/hr/services/MemberService';

export default class MemberEvent {
  constructor() {
    console.log('Member Events loaded');
  }
  createMember() {
    const memberServce = MemberService.getInstance();
    const eventEmitter = new EventEmitter();
    eventEmitter.on('create-member', async ({ user, organization }) => {
      console.log('-----------------------EventReciver-------------------------');
      await memberServce.create({
        name: user.firstname + ' ' + user.lastname,
        user,
        active: true,
        organization,
        memberType: MemberStatusType.ACTIVE,
      });
      console.log('-------------------------------------------------------------');
    });
  }
}
