import { Member, MembershipStatus, MemberTypeEnum } from '@/modules/hr/models/Member';
import { User, userStatus } from '@/modules/users/models/User';
import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import { Email } from '@/utils/Email';
import { EmailMessage, MemberKey } from '@/types/types';
import { FETCH_STRATEGY } from '@/modules/base';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { MemberDao } from '@/modules/hr/daos/MemberDao';
import { log } from '@/decorators/log';
import { MemberRO } from '@/modules/hr/routes/RequestObject';
import { validate } from '@/decorators/validate';
import { validateParam } from '@/decorators/validateParam';
import { InviteMemberSchema, MemberSchema } from '@/modules/hr/schemas/MemberSchema';
import { Organization } from '@/modules/organizations/models/Organization';
import { UserInviteToOrgRO } from '@/modules/organizations/routes/RequestObject';
import inviteNewMemberTemplate from '@/utils/emailTemplates/inviteNewMember';
import { KeycloakUtil } from '@/sdks/keycloak/KeycloakUtils';
import { NotFoundError } from '@/Exceptions/NotFoundError';
import { ConflictError } from '@/Exceptions/ConflictError';
import { BadRequest } from '@/Exceptions/BadRequestError';

@provideSingleton(IMemberService)
export class MemberService extends BaseService<Member> implements IMemberService {
  constructor(
    public dao: MemberDao,
    public userService: IUserService,
    public organizationService: IOrganizationService,
    public emailService: Email,
    public keycloakUtils: KeycloakUtil,
  ) {
    super(dao);
  }

  static getInstance(): IMemberService {
    return container.get(IMemberService);
  }

  @log()
  @validate
  async inviteUserByEmail(@validateParam(InviteMemberSchema) payload: UserInviteToOrgRO): Promise<Member> {
    const existingOrg = await this.organizationService.get(payload.organizationId);

    if (!existingOrg) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${payload.organizationId}` } });
    }
    const existingUser = await this.keycloakUtils.getUsersByEmail(payload.email);

    let user = null;
    if (existingUser.length > 0) {
      // fetch the existing user
      user = await this.userService.getByCriteria({ email: payload.email }, FETCH_STRATEGY.SINGLE);
    } else {
      const createdKeyCloakUser = await this.keycloakUtils.createKcUser(payload.email);
      //save created keycloak user in the database
      const wrappedUser = this.userService.wrapEntity(User.getInstance(), {
        firstname: '',
        lastname: '',
        email: payload.email,
        keycloakId: createdKeyCloakUser.id,
        status: userStatus.INVITATION_PENDING,
      });
      user = createdKeyCloakUser;

      await this.userService.create(wrappedUser);
    }

    // check whether the user is already a member of the organization
    const isAlreadyMember = await this.getByCriteria({ user, organization: existingOrg });

    if (isAlreadyMember) {
      throw new ConflictError('USER.ALREADY_MEMBER {{user}}', { variables: { user: `${payload.email}` } });
    }

    const wrappedMember = this.wrapEntity(Member.getInstance(), {
      name: user.firstname + ' ' + user.lastname,
      workEmail: user.email,
      status: userStatus.INVITATION_PENDING,
      membership: MembershipStatus.PENDING,
      joinDate: new Date(),
      memberType: MemberTypeEnum.REGULAR,
    });
    wrappedMember.user = user;
    wrappedMember.organization = existingOrg;

    const createdMemberResult = await this.dao.create(wrappedMember);

    existingOrg.members.add(createdMemberResult);

    await this.dao.update(existingOrg);
    const emailMessage: EmailMessage = {
      from: this.emailService.from,
      to: payload.email,
      text: 'Sciencewings - reset password',
      html: inviteNewMemberTemplate(existingOrg.name),
      subject: ' reset password',
    };

    this.emailService.sendEmail(emailMessage);
    return createdMemberResult;
  }

  @log()
  async resendInvite(id: number, orgId: number): Promise<number> {
    const user = await this.userService.get(id);

    if (!user) {
      throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', { variables: { user: `${id}` } });
    }
    const existingOrg = await this.organizationService.get(orgId);

    if (!existingOrg) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${orgId}` } });
    }

    const isUserInOrg = await this.dao.getByCriteria({ user: id }, FETCH_STRATEGY.SINGLE);
    if (!isUserInOrg) {
      throw new NotFoundError('USER.NOT_MEMBER_OF_ORG', { friendly: true });
    }
    if (user.status !== userStatus.INVITATION_PENDING) {
      throw new BadRequest('USER.CANNOT_RESEND_INVITE_TO_ACTIVE_USER', { friendly: true });
    }
    const url = process.env.KEYCKLOACK_RESET_PASSWORD;
    const emailMessage: EmailMessage = {
      from: this.emailService.from,
      to: user.email,
      text: 'Sciencewings - reset password',
      html: `<html><body><a href=${url}>-reset password</a></body></html>`,
      subject: 'reset password',
    };
    this.emailService.sendEmail(emailMessage);
    return user.id;
  }
  /**
   * the user can accpet, reject his membership
   * updating the staus of membership
   * @param payload the status of membership
   * @userId @orgId primary keys of member
   */
  @log()
  @validate
  public async updateMembershipStatus(
    @validateParam(MemberSchema) payload: MemberRO,
    userId: number,
    orgId: number,
  ): Promise<MemberKey> {
    const fetchedUser = await this.userService.get(userId);
    if (!fetchedUser) {
      throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', { variables: { user: `${userId}` } });
    }
    const fetchedOrg = await this.organizationService.get(orgId);
    if (!fetchedOrg) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${orgId}` } });
    }
    const fetchedMember = (await this.dao.getByCriteria(
      { organization: orgId, user: userId },
      FETCH_STRATEGY.SINGLE,
    )) as Member;
    if (!fetchedMember) {
      throw new BadRequest('USER.NOT_MEMBER_OF_ORG', { friendly: true });
    }
    if (!(fetchedMember.membership === MembershipStatus.PENDING)) {
      throw new BadRequest('USER.INVITATION_ALREADY_ANSWERED', { friendly: true });
    }
    const member = this.wrapEntity(fetchedMember, {
      ...fetchedMember,
      ...payload,
    });

    await this.dao.update(member);

    //adding the user to the org Kc member group
    await this.keycloakUtils.addMemberToGroup(fetchedOrg.memberGroupkcid, fetchedUser.keycloakId);

    return { userId, orgId };
  }

  /**
   * fetch all the organizations a given user is a member of
   *
   * @param userId the id of the user to fetch organization memberships for
   */
  @log()
  public async getUserMemberships(userId: number): Promise<Organization[]> {
    const fetchedUser = await this.userService.get(userId);
    if (!fetchedUser) {
      throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', { variables: { user: `${userId}` } });
    }
    const fetchedMembers = (await this.dao.getByCriteria({ user: userId }, FETCH_STRATEGY.ALL)) as Member[];
    const orgs = await Promise.all(
      fetchedMembers.map((member: any) => {
        return this.organizationService.get(member.organization.id);
      }),
    );
    return orgs.filter((o: any) => !o.isFailure).map((o) => o);
  }
  /**
   * switch between different organizations by adding a current_org attribute
   *  in keycloak for the logged in user.
   * @param orgId
   * @param userId
   */
  @log()
  public async switchOrganization(orgId: number, userId: number): Promise<number> {
    const user = await this.userService.get(userId);

    const organization = await this.organizationService.get(orgId);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${orgId}` } });
    }

    const fetchedMember = await this.dao.getByCriteria({ user, organization }, FETCH_STRATEGY.SINGLE);
    if (!fetchedMember) {
      throw new BadRequest('USER.NOT_MEMBER_OF_ORG', { friendly: true });
    }
    //retrieve the organization keycloak group
    const orgKcGroupe = await this.keycloakUtils.getGroupById(organization.kcid);
    if (!orgKcGroupe) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${orgId}` } });
    }
    //change the KcUser current_org attribute
    await this.keycloakUtils.updateKcUser(user.keycloakId, { attributes: { current_org: orgKcGroupe.id } });

    return user.id;
  }

  /**
   * fetch a member profile information
   * since the member is identified by their userId and organizationId
   * we need these two values to properly complete the fetch
   */
  @log()
  async getMemberProfile(payload: { [key: string]: any }): Promise<Member> {
    const memberResult = await this.getByCriteria(
      { user: payload.userId, organization: payload.orgId },
      FETCH_STRATEGY.SINGLE,
      { populate: true },
    );

    if (!memberResult) {
      throw new NotFoundError('MEMBER.NON_EXISTANT');
    }

    return memberResult as Member;
  }

  /**
   *
   * override of the base update method
   * this allows to update the member using their userID and orgID
   *
   *
   * @param memberIds the identifiers of a member which are userID and orgID
   * @param payload
   */
  @log()
  async updateMemberByUserIdAndOrgId(
    memberIds: { [key: string]: any },
    payload: { [key: string]: any },
  ): Promise<number> {
    const memberResult = await this.getMemberProfile(memberIds);

    const entity = this.wrapEntity(memberResult, {
      ...memberResult,
      ...payload,
    });
    await this.dao.update(entity);
    return null;
  }
}
