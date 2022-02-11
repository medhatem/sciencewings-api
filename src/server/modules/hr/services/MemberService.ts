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

  private async checkEntitiesExistance(organization: number, resource: number): Promise<Result<any>> {
    let currentOrg, currentRes;
    if (organization) {
      currentOrg = await this.organizationService.get(organization);
      if (currentOrg.isFailure || currentOrg.getValue() === null) {
        return Result.fail<number>(`Organization with id ${organization} dose not exist.`);
      }
    }
    if (resource) {
      currentRes = await this.resourceService.get(resource);
      if (currentRes.isFailure || currentRes.getValue() === null) {
        return Result.fail<number>(`Resource with id ${resource} dose not exist.`);
      }
    }
    return Result.ok({ currentOrg, currentRes });
  }

  @log()
  @safeGuard()
  @validate(CreateMemberSchema)
  public async createMember(payload: CreateMemberRO): Promise<Result<number>> {
    const existance = await this.checkEntitiesExistance(payload.organization, payload.resource);
    if (existance.isFailure) return Result.fail<number>(existance.error);
    const { currentOrg, currentRes } = await existance.getValue();

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

  @log()
  @safeGuard()
  @validate(CreateMemberSchema)
  public async updateMember(payload: CreateMemberRO, memberId: number): Promise<Result<number>> {
    const member = await this.dao.get(memberId);

    const existance = await this.checkEntitiesExistance(payload.organization, payload.resource);

    if (existance.isFailure) return Result.fail<number>(existance.error);
    // const { currentOrg, currentRes } = await existance.getValue();
    // const newMember: any = {
    //   id: memberId,
    //   ...member,
    // };

    // if (payload.organization) newMember.organization = currentOrg.getValue();
    // if (payload.resource) newMember.resource = currentRes.getValue();

    // delete payload.organization;
    // delete payload.resource;

    // newMember = { ...payload };

    const updateddMember = await this.update(member);
    if (updateddMember.isFailure) {
      return Result.fail<number>(updateddMember.error);
    }
    return Result.ok(updateddMember.getValue().id);
  }
}
