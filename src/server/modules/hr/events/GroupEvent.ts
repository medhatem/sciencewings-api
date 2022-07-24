import { Group } from '@/modules/hr/models/Group';
import { GroupService } from '../services';
import { Organization } from '@/modules/organizations/models/Organization';
import { on } from '@/decorators/events';

export class GroupEvent {
  @on('create-group')
  async createGroup(kcid: string, organization: Organization, name: string): Promise<Group> {
    const groupService = GroupService.getInstance();
    return await groupService.create({
      organization,
      kcid,
      name,
    });
  }

  @on('remove-group')
  async removeGroup(id: number): Promise<Group> {
    const groupService = GroupService.getInstance();
    return await groupService.remove(id);
  }
}
