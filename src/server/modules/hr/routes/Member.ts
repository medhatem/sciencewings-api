import { container, provideSingleton } from '@di/index';
import { MemberService as MemberService } from '../services/MemberService';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { Member } from '../models/Member';
import { Path, GET, QueryParam } from 'typescript-rest';
import { MemberDTO } from '../dtos/MemberDTO';
import { UpdateMemberDTO } from '../dtos/UpdateMemberDTO';

@provideSingleton()
@Path('member')
export class MemberRoutes extends BaseRoutes<Member> {
  constructor(private MemberRoutes: MemberService) {
    super(MemberRoutes, new MemberDTO(), new UpdateMemberDTO());
    console.log(this.MemberRoutes);
  }

  static getInstance(): MemberRoutes {
    return container.get(MemberRoutes);
  }

  @GET
  @Path('newRoute')
  public async newRoute(@QueryParam('body') body: string) {
    return body;
  }
}
