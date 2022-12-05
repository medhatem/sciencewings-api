import { SinonStubbedInstance, createStubInstance, restore, stub } from 'sinon';
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';

import { BaseService } from '@/modules/base/services/BaseService';
import { Configuration } from '@/configuration/Configuration';
import { Keycloak } from '@/sdks/keycloak';
import { KeycloakUtil } from '@/sdks/keycloak/KeycloakUtils';
import { Logger } from '@/utils/Logger';
import { MemberDao } from '@/modules/hr/daos/MemberDao';
import { MemberService } from '@/modules/hr/services/MemberService';
import { OrganizationService } from '@/modules/organizations/services/OrganizationService';
import { UserService } from '@/modules/users/services/UserService';
import { container } from '@/di';
import intern from 'intern';
import { mockMethodWithResult } from '@/utils/utilities';
import { userStatus } from '@/modules/users/models/User';
import { PermissionService } from '@/modules/permissions/services/PermissionService';

const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let memberDao: SinonStubbedInstance<MemberDao>;
  let organizationService: SinonStubbedInstance<OrganizationService>;
  let userService: SinonStubbedInstance<UserService>;
  let permissionService: SinonStubbedInstance<PermissionService>;
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
      .returns(
        new MemberService(
          memberDao,
          userService,
          organizationService,
          permissionService,
          Keycloak.getInstance(),
          keycloakUtil,
        ),
      );
  }

  beforeEach(() => {
    memberDao = createStubInstance(MemberDao);
    organizationService = createStubInstance(OrganizationService);
    userService = createStubInstance(UserService);
    permissionService = createStubInstance(PermissionService);
    keycloakUtil = createStubInstance(KeycloakUtil);

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
      .returns(
        new MemberService(
          memberDao,
          userService,
          organizationService,
          permissionService,
          Keycloak.getInstance(),
          keycloakUtil,
        ),
      );
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
      mockMethodWithResult(organizationService, 'get', [orgId], Promise.resolve(null));
      try {
        await container.get(MemberService).inviteUserByEmail({ email, organizationId: orgId, roles: [1] });
        expect.fail('Unexpected success');
      } catch (error) {
        expect(error.message).to.equal('ORG.NON_EXISTANT_DATA {{org}}');
      }
    });
    test('Should fail on creating user', async () => {
      stubKeyclockInstanceWithBaseService([]);
      mockMethodWithResult(organizationService, 'get', [orgId], Promise.resolve({}));
      mockMethodWithResult(keycloakUtil, 'createKcUser', [email], Promise.resolve({}));
      mockMethodWithResult(keycloakUtil, 'getUsersByEmail', [email], Promise.resolve([]));

      mockMethodWithResult(userService, 'create', [], Promise.reject(new Error('Failed')));

      try {
        await container.get(MemberService).inviteUserByEmail({ email, organizationId: orgId, roles: [1] });
        expect.fail('Unexpected success');
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should succeed on invite user', async () => {
      stubKeyclockInstanceWithBaseService([]);
      mockMethodWithResult(
        organizationService,
        'get',
        [orgId],
        Promise.resolve({
          name: 'org',
          members: {
            add: stub(),
          },
        }),
      );
      mockMethodWithResult(keycloakUtil, 'createKcUser', [email], Promise.resolve({ id: 1 }));
      mockMethodWithResult(keycloakUtil, 'getUsersByEmail', [email], Promise.resolve([]));
      const memberService = container.get(MemberService);
      mockMethodWithResult(userService, 'create', [], Promise.resolve({ id: 1 }));
      mockMethodWithResult(memberDao, 'create', [], Promise.resolve({ user: 1, organization: orgId }));
      stub(BaseService.prototype, 'wrapEntity').returns({});
      stub(BaseService.prototype, 'getByCriteria')
        .withArgs({ user: 1, organization: orgId })
        .returns(Promise.resolve({ firstname: '', lastname: '' }));
      mockMethodWithResult(
        permissionService,
        'get',
        [1],
        Promise.resolve({ id: 1, name: 'create-contract', module: 'organization', operationDB: 'create' }),
      );

      const result = await memberService.inviteUserByEmail({ email, organizationId: orgId, roles: [1] });

      expect(result.user).to.equal(1);
      expect(result.organization).to.equal(orgId);
    });
  });

  suite('resend Invite', () => {
    test('Should fail on retriving user', async () => {
      const userId = 1,
        orgId = 1;
      mockMethodWithResult(userService, 'get', [1], Promise.resolve(null));

      try {
        await container.get(MemberService).resendInvite(userId, orgId);
        expect.fail('Unexpected success');
      } catch (error) {
        expect(error.message).to.equal('USER.NON_EXISTANT_USER {{user}}');
      }
    });
    test('Should fail on retriving organization', async () => {
      const userId = 1;
      const orgId = 1;
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve({}));
      mockMethodWithResult(organizationService, 'get', [orgId], Promise.resolve(null));
      try {
        await container.get(MemberService).resendInvite(userId, orgId);
        expect.fail('Unexpected success');
      } catch (error) {
        expect(error.message).to.equal('ORG.NON_EXISTANT_DATA {{org}}');
      }
    });
    test('Should fail on user in organization', async () => {
      const userId = 1;
      const orgId = 1;
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve({}));
      mockMethodWithResult(organizationService, 'get', [orgId], Promise.resolve({}));
      mockMethodWithResult(memberDao, 'getByCriteria', [{ user: userId }], Promise.resolve(null));
      try {
        await container.get(MemberService).resendInvite(userId, orgId);
        expect.fail('Unexpected success');
      } catch (error) {
        expect(error.message).to.equal('USER.NOT_MEMBER_OF_ORG');
      }
    });
    test('Should fail on resend Invite due to active user', async () => {
      const userId = 1;
      const orgId = 1;
      mockMethodWithResult(
        userService,
        'get',
        [userId],
        Promise.resolve({
          id: userId,
          status: userStatus.ACTIVE,
        }),
      );
      mockMethodWithResult(organizationService, 'get', [orgId], Promise.resolve({}));
      mockMethodWithResult(memberDao, 'getByCriteria', [{ user: userId }], Promise.resolve({}));
      try {
        await container.get(MemberService).resendInvite(userId, orgId);
        expect.fail('Unexpected success');
      } catch (error) {
        expect(error.message).to.equal('USER.CANNOT_RESEND_INVITE_TO_ACTIVE_USER');
      }
    });
    test('Should success on resend Invite', async () => {
      const userId = 1;
      const orgId = 1;
      mockMethodWithResult(
        userService,
        'get',
        [userId],
        Promise.resolve({
          id: userId,
          status: userStatus.INVITATION_PENDING,
        }),
      );
      mockMethodWithResult(organizationService, 'get', [orgId], Promise.resolve({}));
      mockMethodWithResult(memberDao, 'getByCriteria', [{ user: userId }], Promise.resolve({}));
      const result = await container.get(MemberService).resendInvite(userId, orgId);

      expect(result).to.equal(1);
    });
  });

  suite('get user memberships', () => {
    const userId = 1;
    test('Should fail on retriving user', async () => {
      mockMethodWithResult(userService, 'get', [1], Promise.resolve(null));
      try {
        await container.get(MemberService).getUserMemberships(userId);
        expect.fail('Unexpected success');
      } catch (error) {
        expect(error.message).to.equal('USER.NON_EXISTANT_USER {{user}}');
      }
    });
    test('Should return array of organizations', async () => {
      mockMethodWithResult(userService, 'get', [1], Promise.resolve({}));
      mockMethodWithResult(
        memberDao,
        'getByCriteria',
        [{ user: userId }],
        [{ organization: { id: 1 } }, { organization: { id: 2 } }],
      );
      mockMethodWithResult(organizationService, 'get', [1], Promise.resolve({}));
      mockMethodWithResult(organizationService, 'get', [2], Promise.resolve({}));
      const result = await container.get(MemberService).getUserMemberships(userId);
      expect(result).to.eql([{}, {}]);
    });
  });
});
