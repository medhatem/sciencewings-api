import intern from 'intern';
import { stub, restore, SinonStubbedInstance, createStubInstance } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { container } from '@/di';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { MemberService } from '@/modules/hr/services/MemberService';
import { MemberDao } from '@/modules/hr/daos/MemberDao';
import { OrganizationService } from '@/modules/organizations/services/OrganizationService';
import { UserService } from '@/modules/users/services/UserService';
import { Email } from '@/utils/Email';
import { mockMethodWithResult } from '@/utils/utilities';
import { Result } from '@/utils/Result';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let memberDao: SinonStubbedInstance<MemberDao>;
  let organizationService: SinonStubbedInstance<OrganizationService>;
  let userService: SinonStubbedInstance<UserService>;
  let emailService: SinonStubbedInstance<Email>;

  beforeEach(() => {
    memberDao = createStubInstance(MemberDao);
    organizationService = createStubInstance(OrganizationService);
    userService = createStubInstance(UserService);
    emailService = createStubInstance(Email);

    const _container = stub(container, 'get');
    _container.withArgs(Configuration).returns({
      getConfiguration: stub(),
      currentENV: 'test',
    });
    _container.withArgs(Logger).returns({
      setup: stub(),
      info: stub(),
      error: stub(),
      warn: stub(),
    });
    _container
      .withArgs(MemberService)
      .returns(new MemberService(memberDao, userService, organizationService, emailService));
  });

  afterEach(() => {
    restore();
  });

  test('should create the right instance', () => {
    const instance = MemberService.getInstance();
    expect(instance instanceof MemberService);
  });

  // suite('invite User By Email', () => {});

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
    test('Should success on resend Invite', async () => {
      const userId = 1;
      const orgId = 1;
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve(Result.ok({})));
      mockMethodWithResult(organizationService, 'get', [orgId], Promise.resolve(Result.ok({})));
      mockMethodWithResult(memberDao, 'getByCriteria', [{ user: userId }], Promise.resolve({}));
      const result = await container.get(MemberService).resendInvite(userId, orgId);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.equal(1);
    });
  });
});
