import { Resource } from '@modules/resources/models/Resource';
import { Organization } from '@modules/organizations/models/Organization';
import { container, provideSingleton } from '@di/index';
import { BaseService } from '@modules/base/services/BaseService';
import { Member } from '@modules/hr/models/Member';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';
import { IMemberService } from '..';
import { MemberDao } from '../daos/MemberDao';
import { Result } from '@utils/Result';
import { CreateMemberRO } from '@modules/hr/routes/RequestObject';
import { validate } from '../../../decorators/bodyValidationDecorators/validate';
import { CreateMemberSchema } from '@modules/hr/schemas/CreateMemeberSchema';
import { IOrganizationService } from '@modules/organizations/interfaces';
import { IResourceService } from '@modules/resources/interfaces';

@provideSingleton(IMemberService)
export class MemberService extends BaseService<Member> implements IMemberService {
  constructor(
    public dao: MemberDao,
    public organizationService: IOrganizationService,
    public resourceService: IResourceService,
  ) {
    super(dao);
  }

  static getInstance(): IMemberService {
    return container.get(IMemberService);
  }

  @log()
  @safeGuard()
  @validate(CreateMemberSchema)
  public async createMember(payload: CreateMemberRO): Promise<Result<number>> {
    const currentOrg = await this.organizationService.get(payload.organization);
    if (currentOrg.isFailure || currentOrg.getValue() === null) {
      return Result.fail<number>(`Organization with id ${payload.organization} dose not exist.`);
    }
    const currentRes = await this.resourceService.get(payload.resource);
    if (currentRes.isFailure || currentRes.getValue() === null) {
      return Result.fail<number>(`Resource with id ${payload.resource} dose not exist.`);
    }
    const member: Member = {
      id: null,
      ...payload,
      organization: currentOrg.getValue(),
      resource: currentRes.getValue(),
    };

    const createdMember = await this.create(member);
    if (createdMember.isFailure) {
      return Result.fail<number>(createdMember.error);
    }
    return Result.ok(createdMember.getValue().id);
  }
}
