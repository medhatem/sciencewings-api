import intern from 'intern';
import { stub, restore, SinonStubbedInstance, createStubInstance } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { container } from '@/di';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { LocalStorage } from '@/utils/LocalStorage';
import { mockMethodWithResult } from '@/utils/utilities';
import { UserInviteToOrgRO, UserResendPassword } from '@/modules/organizations/routes/RequestObject';
import { Result } from '@/utils/Result';
import { MemberService } from '@/modules/hr/services/MemberService';
import { MemberRoutes } from '@/modules/hr/routes/MemberRoutes';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let memberService: SinonStubbedInstance<MemberService>;
  let memberRoutes: MemberRoutes;
  beforeEach(() => {
    createStubInstance(Configuration);
    memberService = createStubInstance(MemberService);
    stub(LocalStorage, 'getInstance').returns(new LocalStorage());
    const mockedContainer = stub(container, 'get');
    mockedContainer.withArgs(Configuration).returns({
      getConfiguration: stub(),
      currentENV: 'test',
    });
    mockedContainer.withArgs(Logger).returns({
      setup: stub(),
      info: stub(),
      error: stub(),
      warn: stub(),
    });
    mockedContainer.withArgs(MemberRoutes).returns(new MemberRoutes(memberService));
    memberRoutes = container.get(MemberRoutes);
  });

  afterEach(() => {
    restore();
  });

  test('should create the right instance', () => {
    const instance = MemberRoutes.getInstance();
    expect(instance instanceof MemberRoutes);
  });
  suite('POST members/resendInvite', () => {
    const payload: UserResendPassword = {
      userId: 1,
      orgId: 1,
    };
    test('Should fail on throw error', async () => {
      mockMethodWithResult(
        memberService,
        'resendInvite',
        [payload.userId, payload.orgId],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await memberRoutes.resendInvite(payload);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('Should success at returning the right value', async () => {
      mockMethodWithResult(memberService, 'resendInvite', [payload.userId, payload.orgId], Result.ok(1));
      const result = await memberRoutes.resendInvite(payload);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(201);
    });
  });
  suite('POST members/inviteUserToOrganization', () => {
    const payload: UserInviteToOrgRO = {
      organizationId: 1,

      email: 'test',
    };
    test('Should fail on throw error', async () => {
      mockMethodWithResult(
        memberService,
        'inviteUserByEmail',
        [payload.email, payload.organizationId],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await memberRoutes.inviteUserToOrganization(payload);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('Should success at returning the right value', async () => {
      mockMethodWithResult(memberService, 'inviteUserByEmail', [payload.email, payload.organizationId], Result.ok(1));
      const result = await memberRoutes.inviteUserToOrganization(payload);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(201);
    });
  });
});
