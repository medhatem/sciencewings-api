import { Member, MemberTypeEnum } from '@/modules/hr/models/Member';
import { User, userStatus } from '@/modules/users/models/User';
import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import { Email } from '@/utils/Email';
import { EmailMessage } from '@/types/types';
import { FETCH_STRATEGY } from '@/modules/base';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { MemberDao } from '@/modules/hr/daos/MemberDao';
import { Result } from '@/utils/Result';
import { getConfig } from '@/configuration/Configuration';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';

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
  async inviteUserByEmail(email: string, orgId: number): Promise<Result<Member>> {
    let existingUser;
    try {
      existingUser = await this.keycloak
        .getAdminClient()
        .users.find({ email, realm: getConfig('keycloak.clientValidation.realmName') });
    } catch (error) {
      return Result.fail('Something went wrong when retriving the user.');
    }

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
    const wrappedUser = this.userService.wrapEntity(new User(), user);
    const savedUser = await this.userService.create(wrappedUser);
    if (savedUser.isFailure) {
      return savedUser;
    }
    const savedUserValue = savedUser.getValue();
    // create member for the organization
    const wrappedMember = this.wrapEntity(new Member(), {
      memberType: MemberTypeEnum.REGULAR,
    });
    wrappedMember.user = savedUserValue;
    wrappedMember.name = savedUserValue.firstname + ' ' + savedUserValue.lastname;
    wrappedMember.workEmail = savedUserValue.email;
    wrappedMember.status = userStatus.INVITATION_PENDING;
    wrappedMember.joinDate = new Date();
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
}
