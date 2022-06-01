import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { Member, MemberTypeEnum } from '@/modules/hr/models/Member';
import { MemberDao } from '@/modules/hr/daos/MemberDao';
import { Result } from '@/utils/Result';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { getConfig } from '@/configuration/Configuration';
import { User, userStatus } from '@/modules/users/models/User';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { Email } from '@/utils/Email';
import { EmailMessage } from '@/types/types';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';

@provideSingleton(IMemberService)
export class MemberService extends BaseService<Member> implements IMemberService {
  constructor(
    public dao: MemberDao,
    public userService: IUserService,
    public organizationService: IOrganizationService,
    public emailService: Email,
  ) {
    super(dao);
  }

  static getInstance(): IMemberService {
    return container.get(IMemberService);
  }

  @log()
  @safeGuard()
  async inviteUserByEmail(email: string, orgId: number): Promise<Result<number>> {
    const existingUser = await this.keycloak
      .getAdminClient()
      .users.find({ email, realm: getConfig('keycloak.clientValidation.realmName') });

    if (existingUser.length > 0) {
      return Result.fail('The user already exist.');
    }

    const existingOrg = await this.organizationService.get(orgId);

    if (existingOrg.isFailure || existingOrg.getValue() === null) {
      return Result.notFound('The organization to add the user to does not exist.');
    }

    const existingOrgValue = existingOrg.getValue();

    const createdKeyCloakUser = await this.keycloak.getAdminClient().users.create({
      email,
      firstName: '',
      lastName: '',
      realm: getConfig('keycloak.clientValidation.realmName'),
    });

    //save created keycloak user in the database
    const user = new User();
    user.firstname = '';
    user.lastname = '';
    user.email = email;
    user.keycloakId = createdKeyCloakUser.id;
    const wrappedUser = this.userService.wrapEntity(new User(), user, false);
    const savedUser = await this.userService.create(wrappedUser);
    if (savedUser.isFailure) {
      return savedUser;
    }
    // create member for the organization
    const wrappedMember = this.wrapEntity(new Member(), {
      memberType: MemberTypeEnum.Regular,
    });
    wrappedMember.user = savedUser.getValue();
    wrappedMember.organization = existingOrgValue;
    const createdMemberResult = await this.dao.create(wrappedMember);

    existingOrgValue.members.add(createdMemberResult);

    await this.dao.update(existingOrgValue);
    const emailMessage: EmailMessage = {
      from: this.emailService.from,
      to: email,
      text: 'Sciencewings - reset password',
      html: '<html><body>Reset password</body></html>',
      subject: ' reset password',
    };

    this.emailService.sendEmail(emailMessage);
    user.status = userStatus.INVITATION_PENDING;
    await this.userService.update(user);

    return Result.ok<number>(savedUser.getValue().id);
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
}
