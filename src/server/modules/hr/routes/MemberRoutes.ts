import { container, provideSingleton } from '@di/index';
import { BaseRoutes } from '@modules/base/routes/BaseRoutes';
import { Member } from '../models/Member';
import { Path, POST, Security } from 'typescript-rest';
import { MemberDTO } from '../dtos/MemberDTO';
import { KEYCLOAK_TOKEN } from '../../../authenticators/constants';
import { LoggerStorage } from '../../../decorators/loggerStorage';
import { CreateMemberRO } from './RequestObject';
import { IMemberService } from '@modules/hr/interfaces';
import { CreateMemberDTO } from '@modules/hr/dtos/CreateMemberDTO';
import { UpdateMemberDTO } from '@modules/hr/dtos/UpdateMemberDTO';

@provideSingleton()
@Path('members')
export class MemberRoutes extends BaseRoutes<Member> {
  constructor(private memberService: IMemberService) {
    super(memberService as any, CreateMemberDTO, UpdateMemberDTO);
  }

  static getInstance(): MemberRoutes {
    return container.get(MemberRoutes);
  }

  @POST
  @Path('create')
  // @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async createOrganization(payload: CreateMemberRO): Promise<MemberDTO> {
    const result = await this.memberService.createMember(payload);

    if (result.isFailure) {
      return new MemberDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new MemberDTO().serialize({ body: { memberId: result.getValue(), statusCode: 201 } });
  }
}
