import {
  MemberDTO,
  UpdateMemberBodyDTO,
  getMembershipDTO,
  getAllMembershipsBodyDTO,
  UpdateMemberDTO,
} from '@/modules/hr/dtos/MemberDTO';
import { POST, Path, Security, PUT, PathParam, GET } from 'typescript-rest';
import { container, provideSingleton } from '@/di/index';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Member } from '@/modules/hr/models/Member';
import { Response } from 'typescript-rest-swagger';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { InviteUserBodyDTO, InviteUserDTO } from '@/modules/organizations/dtos/InviteUserDTO';
import { UserIdDTO, UserInviteToOrgRO } from '@/modules/users';
import { UserResendPassword } from '@/modules/organizations/routes/RequestObject';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { MemberRO } from './RequestObject';

@provideSingleton()
@Path('members')
export class MemberRoutes extends BaseRoutes<Member> {
  constructor(private MemberService: IMemberService) {
    super(MemberService as any, new MemberDTO(), new UpdateMemberDTO());
  }

  static getInstance(): MemberRoutes {
    return container.get(MemberRoutes);
  }

  /**
   * invite a user to an organization
   * creates the newly invited user in keycloak
   *
   * @param payload
   */
  @POST
  @Path('inviteUserToOrganization')
  @Response<InviteUserBodyDTO>(201, 'User Registred Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  @Security()
  @LoggerStorage()
  public async inviteUserToOrganization(payload: UserInviteToOrgRO): Promise<InviteUserDTO> {
    const result = await this.MemberService.inviteUserByEmail(payload.email, payload.organizationId);
    if (result.isFailure) {
      throw result.error;
    }

    return new InviteUserDTO({
      body: { statusCode: 201, id: result.getValue() },
    });
  }

  /**
   * resend the reset password email to the invited user
   *
   * @param payload
   *
   */
  @POST
  @Path('resendInvite')
  @Response<UserIdDTO>(200, 'invite resent successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  @Security()
  @LoggerStorage()
  public async resendInvite(payload: UserResendPassword): Promise<InviteUserDTO> {
    const result = await this.MemberService.resendInvite(payload.userId, payload.orgId);

    if (result.isFailure) {
      throw result.error;
    }
    return new InviteUserDTO({
      body: { statusCode: 201, id: result.getValue() },
    });
  }
  /**
   * Update a Membership status in the database
   *
   * @param payload
   * Should contain Resource data that include Resource data with its id
   * @param id
   * id of the requested resource
   */
  @PUT
  @Path('/:userId/:orgId/membership')
  @Security()
  @LoggerStorage()
  @Response<UpdateMemberBodyDTO>(204, 'Resource updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateMembershipStatus(
    payload: MemberRO,
    @PathParam('userId') userId: number,
    @PathParam('orgId') orgId: number,
  ): Promise<UpdateMemberDTO> {
    const result = await this.MemberService.updateMembershipStatus(payload, userId, orgId);
    if (result.isFailure) {
      throw result.error;
    }
    return new UpdateMemberDTO({ body: { ...result.getValue(), statusCode: 204 } });
  }
  /**
   * get all user memberships
   *
   * @param userId userId
   */
  @GET
  @Path('/:userId/memberships')
  @Security()
  @LoggerStorage()
  @Response<getAllMembershipsBodyDTO>(200, 'Resource Retrived Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getUserMemberships(@PathParam('userId') userId: number): Promise<getMembershipDTO> {
    const result = await this.MemberService.getUserMemberships(userId);

    if (result.isFailure) {
      throw result.error;
    }

    return new getMembershipDTO({ body: { data: [result.getValue()], statusCode: 200 } });
  }
}
