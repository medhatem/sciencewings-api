import { GroupService } from '../services';
import { Organization } from '@/modules/organizations/models/Organization';
import { Result } from '@/utils/Result';
import { on } from '@/decorators/events';
import { safeGuard } from '@/decorators/safeGuard';

export class GroupEvent {
  @on('create-group')
  @safeGuard()
  async createGroup(kcid: string, organization: Organization, name: string): Promise<Result<any>> {
    const groupService = GroupService.getInstance();
    return await groupService.create({
      organization,
      kcid,
      name,
    });
  }

  @on('remove-group')
  @safeGuard()
  async removeGroup(id: number): Promise<Result<any>> {
    const groupService = GroupService.getInstance();
    const result = await groupService.remove(id);
    return Result.ok(result);
  }
}
