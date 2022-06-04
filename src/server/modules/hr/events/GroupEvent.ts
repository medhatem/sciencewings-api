import { on } from '@/decorators/events';
import { Organization } from '@/modules/organizations/models/Organization';
import { GroupService } from '../services';

export class GroupEvent {
  @on('create-group')
  async createGroup(kcid: string, organization: Organization, name: string) {
    const groupService = GroupService.getInstance();
    await groupService.create({
      organization,
      kcid,
      name,
    });
  }
}
