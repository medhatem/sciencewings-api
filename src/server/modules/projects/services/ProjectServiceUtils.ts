import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { Member } from '@/modules/hr/models/Member';
import { Result } from '@/utils/Result';

/**
 * check if the members does exist
 * given an array of member ids
 * @param entities
 * @returns
 */
export const checkMemberExistance = async (
  membersPayload: number[],
  memberService: IMemberService,
): Promise<Result<any>> => {
  const members: Member[] = [];

  for (const member of membersPayload) {
    const getMember = await memberService.get(member);
    const getMemberValue = getMember.getValue();
    if (!getMemberValue) {
      return Result.fail(`Member with id ${member} does not exist`);
    }
    members.push(getMemberValue);
  }

  return Result.ok(members);
};
