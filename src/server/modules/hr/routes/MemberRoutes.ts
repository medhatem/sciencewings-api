import {
  SwitchedMemberDTO,
  UpdateMemberBodyDTO,
  getMembershipDTO,
  UpdateMemberDTO,
  MemberBodyDTO,
  MemberRequestDTO,
  MemberProfileBodyDTO,
} from '@/modules/hr/dtos/MemberDTO';
import { POST, Path, Security, PUT, PathParam, GET, ContextRequest } from 'typescript-rest';
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
import { UserRequest } from '@/types/UserRequest';
import { MemberRO } from './RequestObject';

@provideSingleton()
@Path('members')
export class MemberRoutes extends BaseRoutes<Member> {
  constructor(private MemberService: IMemberService) {
    super(MemberService as any, new MemberRequestDTO(), new UpdateMemberDTO());
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
    const result = await this.MemberService.inviteUserByEmail(payload);

    return new InviteUserDTO({
      body: { statusCode: 201, id: result },
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

    return new InviteUserDTO({
      body: { statusCode: 201, id: result },
    });
  }

  /**
   * update the current_org
   *
   * @param orgId  id of the organization to switch to
   *
   */
  @PUT
  @Path('switchOrganization/:orgId')
  @Security()
  @LoggerStorage()
  @Response<MemberBodyDTO>(204, 'Organization updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async switchOrganization(
    @PathParam('orgId') orgId: number,
    @ContextRequest request: UserRequest,
  ): Promise<SwitchedMemberDTO> {
    const result = await this.MemberService.switchOrganization(orgId, request.userId);

    return new SwitchedMemberDTO({ body: { id: result, statusCode: 204 } });
  }
  /**
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

    return new UpdateMemberDTO({ body: { ...result, statusCode: 204 } });
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
  @Response<getMembershipDTO>(200, 'Resource Retrived Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getUserMemberships(@PathParam('userId') userId: number): Promise<getMembershipDTO> {
    const result = await this.MemberService.getUserMemberships(userId);

    return new getMembershipDTO({ body: { data: [...(result || [])], statusCode: 200 } });
  }

  /**
   * get a member profile details
   * the member is identified with an organization id and a user id
   *
   * @param orgId organization that the member belongs to
   * @param userId that the member refers to
   */
  @GET
  @Path('/getMemberProfile/:orgId/:userId')
  @Security()
  @LoggerStorage()
  @Response<MemberProfileBodyDTO>(200, 'Resource Retrived Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getMemberProfile(
    @PathParam('orgId') orgId: number,
    @PathParam('userId') userId: number,
  ): Promise<MemberProfileBodyDTO> {
    const result = await this.MemberService.getMemberProfile({ orgId, userId });

    return new MemberProfileBodyDTO({ body: result, statusCode: 200 });
  }
  /**
   * override the base update
   * since the member is identified with a userId and an organizationId
   *
   * @param orgId organization that the member belongs to
   * @param userId that the member refers to
   */
  @PUT
  @Path('/:orgId/:userId')
  @Security()
  @LoggerStorage()
  @Response<MemberProfileBodyDTO>(200, 'Resource Retrived Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateMember(
    @PathParam('orgId') orgId: number,
    @PathParam('userId') userId: number,
    payload: MemberRO,
  ): Promise<MemberProfileBodyDTO> {
    const result = await this.MemberService.updateMemberByUserIdAndOrgId({ orgId, userId }, payload);
    return new MemberProfileBodyDTO({ body: result, statusCode: 200 });
  }
}
