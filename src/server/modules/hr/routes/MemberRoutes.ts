import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Member } from '@/modules/hr/models/Member';
import { Path, PathParam, POST, PUT, Security } from 'typescript-rest';
import { MemberDTO } from '../dtos/MemberDTO';
import { KEYCLOAK_TOKEN } from '@/modules/../authenticators/constants';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { CreateMemberRO } from './RequestObject';
import { IMemberService } from '../../hr/interfaces';
import { CreateMemberDTO } from '../../hr/dtos/CreateMemberDTO';
import { UpdateMemberDTO } from '../../hr/dtos/UpdateMemberDTO';
import { Response } from 'typescript-rest-swagger';

@provideSingleton()
@Path('members')
export class MemberRoutes extends BaseRoutes<Member> {
  constructor(private memberService: IMemberService) {
    super(memberService as any, new CreateMemberDTO(), new UpdateMemberDTO());
  }

  static getInstance(): MemberRoutes {
    return container.get(MemberRoutes);
  }

  @POST
  @Path('create')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  @Response<CreateMemberRO>(201, 'Member created Successfully')
  @Response<CreateMemberRO>(500, 'Internal Server Error')
  public async createMember(payload: CreateMemberRO): Promise<MemberDTO> {
    const result = await this.memberService.createMember(payload);

    if (result.isFailure) {
      return new MemberDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new MemberDTO().serialize({ body: { memberId: result.getValue(), statusCode: 201 } });
  }

  @PUT
  @Path('/update/:id')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  @Response<MemberDTO>(204, 'Member updated Successfully')
  @Response<MemberDTO>(500, 'Internal Server Error')
  public async createUpdateMember(payload: CreateMemberRO, @PathParam('id') id: number): Promise<MemberDTO> {
    const result = await this.memberService.updateMember(payload, id);

    if (result.isFailure) {
      return new MemberDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new MemberDTO().serialize({ body: { memberId: result.getValue(), statusCode: 204 } });
  }
}
