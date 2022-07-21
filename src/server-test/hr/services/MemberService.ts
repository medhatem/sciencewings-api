import { SinonStubbedInstance, createStubInstance, restore, stub } from 'sinon';
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';

import { BaseService } from '@/modules/base/services/BaseService';
import { Configuration } from '@/configuration/Configuration';
import { Email } from '@/utils/Email';
import { Keycloak } from '@/sdks/keycloak';
import { KeycloakUtil } from '@/sdks/keycloak/KeycloakUtils';
import { Logger } from '@/utils/Logger';
import { MemberDao } from '@/modules/hr/daos/MemberDao';
import { MemberService } from '@/modules/hr/services/MemberService';
import { OrganizationService } from '@/modules/organizations/services/OrganizationService';
import { Result } from '@/utils/Result';
import { UserService } from '@/modules/users/services/UserService';
import { container } from '@/di';
import intern from 'intern';
import inviteNewMemberTemplate from '@/utils/emailTemplates/inviteNewMember';
import { mockMethodWithResult } from '@/utils/utilities';
import { userStatus } from '@/modules/users/models/User';

const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let memberDao: SinonStubbedInstance<MemberDao>;
  let organizationService: SinonStubbedInstance<OrganizationService>;
  let userService: SinonStubbedInstance<UserService>;
  let emailService: SinonStubbedInstance<Email>;
  let keycloakUtil: SinonStubbedInstance<KeycloakUtil>;
  let containerStub: any = null;

  function stubKeyclockInstanceWithBaseService(users: any) {
    stub(Keycloak, 'getInstance').returns({
      getAdminClient: () => {
        return {
          users: {
            create: () => {
              return {} as any;
            },
            find: () => users as any,
          },
        };
      },
    } as any);

    containerStub.withArgs(BaseService).returns(new BaseService({} as any));
    containerStub
      .withArgs(MemberService)
      .returns(new MemberService(memberDao, userService, organizationService, emailService, keycloakUtil));
  }

  beforeEach(() => {
    memberDao = createStubInstance(MemberDao);
    organizationService = createStubInstance(OrganizationService);
    userService = createStubInstance(UserService);
    emailService = createStubInstance(Email);

    containerStub = stub(container, 'get');
    containerStub.withArgs(Configuration).returns({
      getConfiguration: stub(),
      currentENV: 'test',
    });
    containerStub.withArgs(Logger).returns({
      setup: stub(),
      info: stub(),
      error: stub(),
      warn: stub(),
    });

    containerStub
      .withArgs(MemberService)
      .returns(new MemberService(memberDao, userService, organizationService, emailService, keycloakUtil));
  });

  afterEach(() => {
    restore();
  });

  test('Should create the right instance', () => {
    const instance = MemberService.getInstance();
    expect(instance instanceof MemberService);
  });

  suite('invite User By Email', async () => {
    const email = 'aze@aze.com';
    const orgId = 1;
    test('Should fail on retriving organization', async () => {
      stubKeyclockInstanceWithBaseService([]);
      mockMethodWithResult(organizationService, 'get', [orgId], Promise.resolve(Result.ok(null)));
      const result = await container.get(MemberService).inviteUserByEmail({ email, organizationId: orgId });

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`The organization to add the user to does not exist.`);
    });
    test('Should fail on creating user', async () => {
      stubKeyclockInstanceWithBaseService([]);
      mockMethodWithResult(organizationService, 'get', [orgId], Promise.resolve(Result.ok({})));
      mockMethodWithResult(userService, 'create', [], Promise.resolve(Result.fail('StackTrace')));

      const result = await container.get(MemberService).inviteUserByEmail({ email, organizationId: orgId });

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Could not create the User with email ${email}`);
    });
    test('Should success on invite user', async () => {
      stubKeyclockInstanceWithBaseService([]);
      mockMethodWithResult(
        organizationService,
        'get',
        [orgId],
        Promise.resolve(
          Result.ok({
            name: 'org',
            members: {
              add: stub(),
            },
          }),
        ),
      );
      const memberService = container.get(MemberService);
      mockMethodWithResult(userService, 'create', [], Promise.resolve(Result.ok({ id: 1 })));
      mockMethodWithResult(memberDao, 'create', [], Promise.resolve({ user: 1, organization: orgId }));
      stub(BaseService.prototype, 'wrapEntity').returns({});
      stub(BaseService.prototype, 'getByCriteria').returns(Promise.resolve(null));
      mockMethodWithResult(
        emailService,
        'sendEmail',
        [
          {
            from: memberService.emailService.from,
            to: email,
            text: 'Sciencewings - reset password',
            html: inviteNewMemberTemplate('org'),
            subject: ' reset password',
          },
        ],
        Promise.resolve(''),
      );

      const result = await memberService.inviteUserByEmail({ email, organizationId: orgId });
      expect(result.isSuccess).to.be.true;
      expect(result.getValue().user).to.equal(1);
      expect(result.getValue().organization).to.equal(orgId);
    });
  });

  suite('resend Invite', () => {
    test('Should fail on retriving user', async () => {
      const userId = 1,
        orgId = 1;
      mockMethodWithResult(userService, 'get', [1], Promise.resolve(Result.ok(null)));
      const result = await container.get(MemberService).resendInvite(userId, orgId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`user with id ${userId} not exist.`);
    });
    test('Should fail on retriving organization', async () => {
      const userId = 1;
      const orgId = 1;
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve(Result.ok({})));
      mockMethodWithResult(organizationService, 'get', [orgId], Promise.resolve(Result.ok(null)));
      const result = await container.get(MemberService).resendInvite(userId, orgId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Organization with id ${orgId} does not exist.`);
    });
    test('Should fail on user in organization', async () => {
      const userId = 1;
      const orgId = 1;
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve(Result.ok({})));
      mockMethodWithResult(organizationService, 'get', [orgId], Promise.resolve(Result.ok({})));
      mockMethodWithResult(memberDao, 'getByCriteria', [{ user: userId }], Promise.resolve(null));
      const result = await container.get(MemberService).resendInvite(userId, orgId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`user with id ${userId} is not member in organization.`);
    });
    test('Should fail on resend Invite due to active user', async () => {
      const userId = 1;
      const orgId = 1;
      mockMethodWithResult(
        userService,
        'get',
        [userId],
        Promise.resolve(
          Result.ok({
            id: userId,
            status: userStatus.ACTIVE,
          }),
        ),
      );
      mockMethodWithResult(organizationService, 'get', [orgId], Promise.resolve(Result.ok({})));
      mockMethodWithResult(memberDao, 'getByCriteria', [{ user: userId }], Promise.resolve({}));
      const result = await container.get(MemberService).resendInvite(userId, orgId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal('Cannot resend invite to an active user.');
    });
    test('Should success on resend Invite', async () => {
      const userId = 1;
      const orgId = 1;
      mockMethodWithResult(
        userService,
        'get',
        [userId],
        Promise.resolve(
          Result.ok({
            id: userId,
            status: userStatus.INVITATION_PENDING,
          }),
        ),
      );
      mockMethodWithResult(organizationService, 'get', [orgId], Promise.resolve(Result.ok({})));
      mockMethodWithResult(memberDao, 'getByCriteria', [{ user: userId }], Promise.resolve({}));
      const result = await container.get(MemberService).resendInvite(userId, orgId);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.equal(1);
    });
  });

  suite('get user memberships', () => {
    const userId = 1;
    test('Should fail on retriving user', async () => {
      mockMethodWithResult(userService, 'get', [1], Promise.resolve(Result.notFound(null)));
      const result = await container.get(MemberService).getUserMemberships(userId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`User with id: ${userId} does not exist.`);
    });
    test('Should return array of organizations', async () => {
      mockMethodWithResult(userService, 'get', [1], Promise.resolve(Result.ok({})));
      mockMethodWithResult(
        memberDao,
        'getByCriteria',
        [{ user: userId }],
        [{ organization: { id: 1 } }, { organization: { id: 2 } }],
      );
      mockMethodWithResult(organizationService, 'get', [1], Promise.resolve(Result.ok({})));
      mockMethodWithResult(organizationService, 'get', [2], Promise.resolve(Result.ok({})));
      const result = await container.get(MemberService).getUserMemberships(userId);
      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.eql([{}, {}]);
    });
  });
});
