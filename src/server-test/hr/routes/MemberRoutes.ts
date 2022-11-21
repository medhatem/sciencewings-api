import { SinonStubbedInstance, createStubInstance, restore, stub } from 'sinon';
import { UserInviteToOrgRO, UserResendPassword } from '@/modules/organizations/routes/RequestObject';
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';

import { Configuration } from '@/configuration/Configuration';
import { LocalStorage } from '@/utils/LocalStorage';
import { Logger } from '@/utils/Logger';
import { MemberRoutes } from '@/modules/hr/routes/MemberRoutes';
import { MemberService } from '@/modules/hr/services/MemberService';
import { container } from '@/di';
import intern from 'intern';
import { mockMethodWithResult } from '@/utils/utilities';

const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');

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

  test('Should create the right instance', () => {
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
        Promise.reject(new Error('Failed')),
      );
      try {
        await memberRoutes.resendInvite(payload);
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should succeed at returning the right value', async () => {
      mockMethodWithResult(memberService, 'resendInvite', [payload.userId, payload.orgId], 1);
      const result = await memberRoutes.resendInvite(payload);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(201);
    });
  });
  suite('POST members/inviteUserToOrganization', () => {
    const payload: UserInviteToOrgRO = {
      organizationId: 1,
      email: 'test',
      roles: ['regular'],
    };
    test('Should fail on throw error', async () => {
      mockMethodWithResult(
        memberService,
        'inviteUserByEmail',
        [{ email: payload.email, organizationId: payload.organizationId }],
        Promise.reject(new Error('Failed')),
      );
      try {
        await memberRoutes.inviteUserToOrganization(payload);
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should succeed at returning the right value', async () => {
      mockMethodWithResult(
        memberService,
        'inviteUserByEmail',
        [{ email: payload.email, organizationId: payload.organizationId, role: ['regular'] }],
        1,
      );
      const result = await memberRoutes.inviteUserToOrganization(payload);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(201);
    });
  });

  suite('GET members/:userId/memberships', () => {
    test('Should fail on throw error', async () => {
      mockMethodWithResult(memberService, 'getUserMemberships', [1], Promise.reject(new Error('Failed')));
      try {
        await memberRoutes.getUserMemberships(1);
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should succeed at returning the right value', async () => {
      mockMethodWithResult(memberService, 'getUserMemberships', [1], [{}]);
      const result = await memberRoutes.getUserMemberships(1);
      expect(result.body.statusCode).to.equal(200);
    });
  });
});
