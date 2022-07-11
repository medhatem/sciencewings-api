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
import { Result } from '@/utils/Result';
import { getConfig } from '@/configuration/Configuration';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';
import { MemberRO } from '@/modules/hr/routes/RequestObject';
import { validate } from '@/decorators/validate';
import { validateParam } from '@/decorators/validateParam';
import { InviteMemberSchema, MemberSchema } from '@/modules/hr/schemas/MemberSchema';
import { Organization } from '@/modules/organizations/models/Organization';
import { UserInviteToOrgRO } from '@/modules/organizations/routes/RequestObject';
import inviteNewMemberTemplate from '@/utils/emailTemplates/inviteNewMember';
import { KeycloakUtil } from '@/sdks/keycloak/KeycloakUtils';

@provideSingleton(IMemberService)
export class MemberService extends BaseService<Member> implements IMemberService {
  constructor(
    public dao: MemberDao,
    public userService: IUserService,
    public organizationService: IOrganizationService,
    public keycloakUtils: KeycloakUtil,
    public emailService: Email,
  ) {
    super(dao);
  }

  static getInstance(): IMemberService {
    return container.get(IMemberService);
  }

  @log()
  @safeGuard()
  @validate
  async inviteUserByEmail(@validateParam(InviteMemberSchema) payload: UserInviteToOrgRO): Promise<Result<Member>> {
    const existingOrg = await this.organizationService.get(payload.organizationId);

    if (existingOrg.isFailure || existingOrg.getValue() === null) {
      return Result.notFound('The organization to add the user to does not exist.');
    }

    let existingUser;
    existingUser = await (
      await this.keycloak.getAdminClient()
    ).users.find({
      email: payload.email,
      realm: getConfig('keycloak.clientValidation.realmName'),
    });

    let user = null;
    if (existingUser.length > 0) {
      // fetch the existing user
      existingUser = await this.userService.getByCriteria({ email: payload.email }, FETCH_STRATEGY.SINGLE);
      user = existingUser;
    } else {
      const createdKeyCloakUser = await (
        await this.keycloak.getAdminClient()
      ).users.create({
        email: payload.email,
        firstName: '',
        lastName: '',
        realm: getConfig('keycloak.clientValidation.realmName'),
      });
      //save created keycloak user in the database
      const wrappedUser = this.userService.wrapEntity(User.getInstance(), {
        firstname: '',
        lastname: '',
        email: payload.email,
        keycloakId: createdKeyCloakUser.id,
        status: userStatus.INVITATION_PENDING,
      });

      user = await this.userService.create(wrappedUser);
      if (user.isFailure) {
        return Result.fail(`Could not create the User with email ${payload.email}`, true);
      }
    }

    const existingOrgValue = existingOrg.getValue();
    const savedUserValue = user.getValue();
    // check whether the user is already a member of the organization
    const isAlreadyMember = await this.getByCriteria({ user: savedUserValue, organization: existingOrg.getValue() });

    if (isAlreadyMember.isFailure) {
      return Result.fail('Internal server error');
    }

    if (isAlreadyMember.getValue() !== null) {
      return Result.fail(`${payload.email} is already a member of ${existingOrg.getValue().name}.`);
    }

    const wrappedMember = this.wrapEntity(Member.getInstance(), {
      name: savedUserValue.firstname + ' ' + savedUserValue.lastname,
      workEmail: savedUserValue.email,
      status: userStatus.INVITATION_PENDING,
      membership: MembershipStatus.PENDING,
      joinDate: new Date(),
      memberType: MemberTypeEnum.REGULAR,
    });
    wrappedMember.user = savedUserValue;
    wrappedMember.organization = existingOrgValue;

    const createdMemberResult = await this.dao.create(wrappedMember);

    existingOrgValue.members.add(createdMemberResult);

    await this.dao.update(existingOrgValue);
    const emailMessage: EmailMessage = {
      from: this.emailService.from,
      to: payload.email,
      text: 'Sciencewings - reset password',
      html: inviteNewMemberTemplate(existingOrg.getValue().name),
      subject: ' reset password',
    };

    this.emailService.sendEmail(emailMessage);
    return Result.ok<Member>(createdMemberResult);
  }

  @log()
  @safeGuard()
  async resendInvite(id: number, orgId: number): Promise<Result<number>> {
    const existingUser = await this.userService.get(id);

    if (existingUser.isFailure || existingUser.getValue() === null) {
      return Result.notFound(`user with id ${id} not exist.`);
    }
    const user = existingUser.getValue();
    const existingOrg = await this.organizationService.get(orgId);

    if (existingOrg.isFailure || existingOrg.getValue() === null) {
      return Result.fail(`Organization with id ${orgId} does not exist.`);
    }

    const isUserInOrg = await this.dao.getByCriteria({ user: id }, FETCH_STRATEGY.SINGLE);
    if (!isUserInOrg) {
      return Result.notFound(`user with id ${id} is not member in organization.`);
    }
    if (user.status !== userStatus.INVITATION_PENDING) {
      return Result.fail(`Cannot resend invite to an active user.`);
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
    return Result.ok<number>(user.id);
  }
  /**
   * the user can accpet, reject his membership
   * updating the staus of membership
   * @param payload the status of membership
   * @userId @orgId primary keys of member
   */
  @log()
  @safeGuard()
  @validate
  public async updateMembershipStatus(
    @validateParam(MemberSchema) payload: MemberRO,
    userId: number,
    orgId: number,
  ): Promise<Result<MemberKey>> {
    const fetchedUser = await this.userService.get(userId);
    if (fetchedUser.isFailure || !fetchedUser.getValue()) {
      return Result.notFound(`User with id: ${userId} does not exist.`);
    }
    const fetchedOrg = await this.organizationService.get(orgId);
    if (fetchedOrg.isFailure || !fetchedOrg.getValue()) {
      return Result.notFound(`organization with id: ${orgId} does not exist.`);
    }
    const fetchedMember = (await this.dao.getByCriteria(
      { organization: orgId, user: userId },
      FETCH_STRATEGY.SINGLE,
    )) as Member;
    if (!fetchedMember) {
      return Result.notFound(`membership of user with id: ${userId} in organization with id: ${orgId} does not exist.`);
    }
    const member = this.wrapEntity(fetchedMember, {
      ...fetchedMember,
      ...payload,
    });

    const updatedMember = await this.dao.update(member);
    if (!updatedMember) {
      return Result.fail(`membership of user with id: ${userId} in organization with id: ${orgId} can not be updated.`);
    }
    //adding the user to the org Kc member group
    try {
      await this.keycloakUtils.addMemberToGroup(fetchedOrg.adminGroupkcid, fetchedUser.keycloakId);
    } catch (error) {
      return Result.fail(error.ressp);
    }

    return Result.ok<any>({ userId, orgId });
  }

  /**
   * fetch all the organizations a given user is a member of
   *
   * @param userId the id of the user to fetch organization memberships for
   */
  @log()
  @safeGuard()
  public async getUserMemberships(userId: number): Promise<Result<Organization[]>> {
    const fetchedUser = await this.userService.get(userId);
    if (fetchedUser.isFailure) {
      return Result.notFound(`User with id: ${userId} does not exist.`);
    }
    const fetchedMembers = (await this.dao.getByCriteria({ user: userId }, FETCH_STRATEGY.ALL)) as Member[];
    const orgs = await Promise.all(
      fetchedMembers.map((member: any) => {
        return this.organizationService.get(member.organization.id);
      }),
    );

    return Result.ok(orgs.filter((o: Result<any>) => !o.isFailure).map((o) => o.getValue()));
  }
  /**
   * switch between different organizations by adding a current_org attribute
   *  in keycloak for the logged in user.
   * @param orgId
   * @param userId
   */
  @log()
  @safeGuard()
  public async switchOrganization(orgId: number, userId: number): Promise<Result<number>> {
    const fetchedUser = await this.userService.get(userId);
    const user = fetchedUser.getValue();
    const fetchedOrganization = await this.organizationService.get(orgId);
    if (fetchedOrganization.isFailure || !fetchedOrganization.getValue()) {
      return Result.notFound(`organization with id: ${orgId} does not exist.`);
    }
    const organization = fetchedOrganization.getValue();
    const fetchedMember = await this.dao.getByCriteria({ user, organization }, FETCH_STRATEGY.SINGLE);
    if (!fetchedMember) {
      return Result.notFound(`User with id: ${userId} is not member in that org`);
    }
    //retrieve the organization keycloak group
    const orgKcGroupe = await (
      await this.keycloak.getAdminClient()
    ).groups.findOne({
      id: organization.kcid,
      realm: getConfig('keycloak.clientValidation.realmName'),
    });

    if (!orgKcGroupe) {
      return Result.notFound(`organization with id: ${orgId} does not exist.`);
    }
    //change the KcUser current_org attribute
    await (
      await this.keycloak.getAdminClient()
    ).users.update(
      { id: user.keycloakId, realm: getConfig('keycloak.clientValidation.realmName') },
      { attributes: { current_org: orgKcGroupe.id } },
    );

    return Result.ok<number>(fetchedUser.id);
  }
}
