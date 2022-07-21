import { CreateOrganizationRO, UpdateOrganizationRO } from '@/modules/organizations/routes/RequestObject';
import { SinonStubbedInstance, createStubInstance, restore, stub } from 'sinon';
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { grpPrifix, orgPrifix } from '@/modules/prifixConstants';

import { AddressService } from '@/modules/address/services/AddressService';
import { AddressType } from '@/modules/address/models/Address';
import { BaseService } from '@/modules/base/services/BaseService';
import { Collection } from '@mikro-orm/core';
import { Configuration } from '@/configuration/Configuration';
import { Email } from '@/utils/Email';
import { Group } from '@/modules/hr/models/Group';
import { GroupEvent } from '@/modules/hr/events/GroupEvent';
import { Keycloak } from '@/sdks/keycloak';
import { KeycloakUtil } from '@/sdks/keycloak/KeycloakUtils';
import { Logger } from '@/utils/Logger';
import { Member } from '@/modules/hr/models/Member';
import { MemberEvent } from '@/modules/hr/events/MemberEvent';
import { OrganizationDao } from '@/modules/organizations/daos/OrganizationDao';
import { OrganizationLabelService } from '@/modules/organizations/services/OrganizationLabelService';
import { OrganizationService } from '@/modules/organizations/services/OrganizationService';
import { OrganizationSettingsService } from '@/modules/organizations/services/OrganizationSettingsService';
import { OrganizationType } from '@/modules/organizations/models/Organization';
import { PhoneService } from '@/modules/phones/services/PhoneService';
import { UserService } from '@/modules/users/services/UserService';
import { container } from '@/di';
import intern from 'intern';
import { mockMethodWithResult } from '@/utils/utilities';

import Sinon = require('sinon');

const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let organizationDAO: SinonStubbedInstance<OrganizationDao>;
  let organizationSettingsService: SinonStubbedInstance<OrganizationSettingsService>;
  let userService: SinonStubbedInstance<UserService>;
  let emailService: SinonStubbedInstance<Email>;
  let addressService: SinonStubbedInstance<AddressService>;
  let phoneService: SinonStubbedInstance<PhoneService>;
  let labelService: SinonStubbedInstance<OrganizationLabelService>;
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
            addToGroup: () => {
              return {} as any;
            },
            find: () => users as any,
          },
          groups: {
            create: () => {
              return {} as any;
            },
            update: () => {
              return {} as any;
            },
            setOrCreateChild: () => {
              return {} as any;
            },
            find: () => users as any,
          },
        };
      },
    } as any);

    containerStub.withArgs(BaseService).returns(new BaseService({} as any));
    containerStub
      .withArgs(OrganizationService)
      .returns(
        new OrganizationService(
          organizationDAO,
          organizationSettingsService,
          userService,
          labelService,
          addressService,
          phoneService,
          emailService,
          Keycloak.getInstance(),
          keycloakUtil,
        ),
      );
  }

  beforeEach(() => {
    createStubInstance(Configuration);
    organizationDAO = createStubInstance(OrganizationDao);
    organizationSettingsService = createStubInstance(OrganizationSettingsService);
    userService = createStubInstance(UserService);
    emailService = createStubInstance(Email);
    addressService = createStubInstance(AddressService);
    phoneService = createStubInstance(PhoneService);
    labelService = createStubInstance(OrganizationLabelService);
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
      .withArgs(OrganizationService)
      .returns(
        new OrganizationService(
          organizationDAO,
          organizationSettingsService,
          userService,
          labelService,
          addressService,
          phoneService,
          emailService,
          Keycloak.getInstance(),
          keycloakUtil,
        ),
      );
  });

  afterEach(() => {
    restore();
  });

  test('Should create the right instance', () => {
    const instance = OrganizationService.getInstance();
    expect(instance instanceof OrganizationService);
  });

  suite('create organization', () => {
    const userId = 1;
    const payload: CreateOrganizationRO = {
      name: 'testingground2',
      email: 'testingground1@gmail.com',
      type: OrganizationType.SERVICE,
      phones: [
        {
          phoneLabel: 'personal',
          phoneCode: '+213',
          phoneNumber: '541110222',
        } as any,
      ],
      labels: ['x', 'y', 'z'],
      members: [] as any,
      addresses: [
        {
          country: 'Canada',
          province: 'Ontario',
          code: '5L8 G9S',
          type: AddressType.ORGANIZATION,
          street: '487 Yardley Cres',
          apartment: '12',
          city: 'Ontario',
        },
      ],
    };

    test('Should fail on organization already exist', async () => {
      // set organization to not exist
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ name: payload.name }], Promise.resolve({}));
      try {
        await container.get(OrganizationService).createOrganization(payload, userId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('{{name}} ALREADY_EXISTS');
      }
    });
    test('Should fail on organization parent does not existe', async () => {
      // set organization to not exist
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ name: payload.name }], Promise.resolve(null));
      // set organization parent to null
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ id: payload.parent }], Promise.resolve(null));
      payload.parent = 1;
      try {
        await container.get(OrganizationService).createOrganization(payload, userId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('ORG.NON_EXISTANT_PARENT_ORG');
      }

      delete payload.parent;
    });

    test('Should fail on find the owner', async () => {
      // set organization to not exist
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ name: payload.name }], Promise.resolve(null));
      // set owner to null
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve(null));

      try {
        await container.get(OrganizationService).createOrganization(payload, userId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('USER.NON_EXISTANT_USER {{user}}');
      }
    });

    test('Should fail on organization creation GIVEN keycloak group creation fail ', async () => {
      // set organization to not exist
      mockMethodWithResult(
        organizationDAO,
        'getByCriteria',
        [
          {
            name: payload.name,
          },
        ],
        Promise.resolve(null),
      );
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve({}));
      // mock settings
      mockMethodWithResult(organizationSettingsService, 'create', [], Promise.resolve({}));
      mockMethodWithResult(
        keycloakUtil,
        'createGroup',
        [`${orgPrifix}${payload.name}`],
        Promise.reject(new Error('SOMETHING_WENT_WRONG')),
      );
      // prepare base
      stub(BaseService.prototype, 'wrapEntity').returns({});

      try {
        await container.get(OrganizationService).createOrganization(payload, userId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('SOMETHING_WENT_WRONG');
      }
    });
    test('Should fail on organization GIVEN keycloak admin group creation failiure', async () => {
      // set organization to not exist
      mockMethodWithResult(
        organizationDAO,
        'getByCriteria',
        [
          [
            {
              $or: [{ name: payload.name }, { email: payload.email }],
            },
          ],
        ],
        Promise.resolve(null),
      );
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve({}));
      // mock settings
      mockMethodWithResult(organizationSettingsService, 'create', [], Promise.resolve({}));
      //mock keycloak organization creation
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${orgPrifix}${payload.name}`], Promise.resolve('123'));
      //mock admin group creation to fail
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}admin`, '123'], Promise.reject('Failed'));
      //mock members group creation to succceed
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}members`, '123'], Promise.resolve());
      mockMethodWithResult(keycloakUtil, 'deleteGroup', ['123'], Promise.resolve()); // mock delete group
      mockMethodWithResult(
        keycloakUtil,
        'addOwnerToGroup',
        ['123', `${orgPrifix}${payload.name}`, undefined],
        Promise.resolve(),
      ); // mock delete group
      // prepare base
      stub(BaseService.prototype, 'wrapEntity').returns({});

      try {
        await container.get(OrganizationService).createOrganization(payload, userId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('SOMETHING_WENT_WRONG');
      }
    });
    test('Should fail on organization GIVEN keycloak members group creation failiure', async () => {
      // set organization to not exist
      mockMethodWithResult(
        organizationDAO,
        'getByCriteria',
        [
          [
            {
              $or: [{ name: payload.name }, { email: payload.email }],
            },
          ],
        ],
        Promise.resolve(null),
      );
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve({}));
      // mock settings
      mockMethodWithResult(organizationSettingsService, 'create', [], Promise.resolve({}));
      //mock keycloak organization creation
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${orgPrifix}${payload.name}`], Promise.resolve('123'));
      //mock admin group creation to succeed
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}admin`, '123'], Promise.resolve());
      //mock members group creation to fail
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}members`, '123'], Promise.reject('Failed'));
      mockMethodWithResult(keycloakUtil, 'deleteGroup', ['123'], Promise.resolve()); // mock delete group
      mockMethodWithResult(
        keycloakUtil,
        'addOwnerToGroup',
        ['123', `${orgPrifix}${payload.name}`, undefined],
        Promise.resolve(),
      ); // mock delete group
      // prepare base
      stub(BaseService.prototype, 'wrapEntity').returns({});

      try {
        await container.get(OrganizationService).createOrganization(payload, userId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('SOMETHING_WENT_WRONG');
      }
    });
    test('Should fail on organization GIVEN organization owner attribute failiure', async () => {
      // set organization to not exist
      mockMethodWithResult(
        organizationDAO,
        'getByCriteria',
        [
          [
            {
              $or: [{ name: payload.name }, { email: payload.email }],
            },
          ],
        ],
        Promise.resolve(null),
      );
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve({}));
      // mock settings
      mockMethodWithResult(organizationSettingsService, 'create', [], Promise.resolve({}));
      //mock keycloak organization creation
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${orgPrifix}${payload.name}`], Promise.resolve('123'));
      //mock admin group creation to succeed
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}admin`, '123'], Promise.resolve());
      //mock members group creation to succeed
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}members`, '123'], Promise.resolve());
      //mock organization owner attribute to fail
      mockMethodWithResult(
        keycloakUtil,
        'addOwnerToGroup',
        ['123', `${orgPrifix}${payload.name}`, undefined],
        Promise.reject(''),
      ); // mock delete group
      mockMethodWithResult(keycloakUtil, 'deleteGroup', ['123'], Promise.resolve()); // mock delete group
      // prepare base
      stub(BaseService.prototype, 'wrapEntity').returns({});

      try {
        await container.get(OrganizationService).createOrganization(payload, userId);
        expect.fail('Unexpected success');
      } catch (error) {
        expect(error.message).to.equal('SOMETHING_WENT_WRONG');
      }
    });

    test('Should fail on create organization WHEN adding owner to admin group', async () => {
      // set organization to not exist
      mockMethodWithResult(
        organizationDAO,
        'getByCriteria',
        [
          [
            {
              $or: [{ name: payload.name }, { email: payload.email }],
            },
          ],
        ],
        Promise.resolve(null),
      );
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve({}));
      // mock settings
      mockMethodWithResult(organizationSettingsService, 'create', [], Promise.resolve({}));
      //mock keycloak organization creation
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${orgPrifix}${payload.name}`], Promise.resolve('123'));
      //mock admin group creation to succeed
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}admin`, '123'], Promise.resolve('244'));
      //mock members group creation to succeed
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}members`, '123'], Promise.resolve());
      //mock organization owner attribute to fail
      mockMethodWithResult(
        keycloakUtil,
        'addOwnerToGroup',
        ['123', `${orgPrifix}${payload.name}`, undefined],
        Promise.resolve(),
      );
      //make adding user to keycloak admin group fail
      mockMethodWithResult(keycloakUtil, 'addMemberToGroup', ['244', undefined], Promise.reject('Failed'));
      // mock delete group
      mockMethodWithResult(keycloakUtil, 'deleteGroup', ['123'], Promise.resolve()); // mock delete group
      // prepare base
      stub(BaseService.prototype, 'wrapEntity').returns({});

      try {
        await container.get(OrganizationService).createOrganization(payload, userId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('SOMETHING_WENT_WRONG');
      }
    });

    test('Should fail on create organization WHEN persisting to db', async () => {
      // set organization to not exist
      mockMethodWithResult(
        organizationDAO,
        'getByCriteria',
        [
          [
            {
              $or: [{ name: payload.name }, { email: payload.email }],
            },
          ],
        ],
        Promise.resolve(null),
      );
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve({}));
      // mock settings
      mockMethodWithResult(organizationSettingsService, 'create', [], Promise.resolve({}));
      //mock keycloak organization creation
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${orgPrifix}${payload.name}`], Promise.resolve('123'));
      //mock admin group creation to succeed
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}admin`, '123'], Promise.resolve('244'));
      //mock members group creation to succeed
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}members`, '123'], Promise.resolve());
      //mock organization owner attribute to fail
      mockMethodWithResult(
        keycloakUtil,
        'addOwnerToGroup',
        ['123', `${orgPrifix}${payload.name}`, undefined],
        Promise.resolve(),
      );
      //make adding user to keycloak admin
      mockMethodWithResult(keycloakUtil, 'addMemberToGroup', ['244', undefined], Promise.resolve());
      // mock delete group
      mockMethodWithResult(keycloakUtil, 'deleteGroup', ['123'], Promise.resolve()); // mock delete group
      // prepare base
      stub(BaseService.prototype, 'wrapEntity').returns({});
      stub(BaseService.prototype, 'create').returns(Promise.reject(''));

      try {
        await container.get(OrganizationService).createOrganization(payload, userId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('SOMETHING_WENT_WRONG');
      }
    });

    test('Should fail on create organization WHEN persisting owner as member in db', async () => {
      // set organization to not exist
      mockMethodWithResult(
        organizationDAO,
        'getByCriteria',
        [
          [
            {
              $or: [{ name: payload.name }, { email: payload.email }],
            },
          ],
        ],
        Promise.resolve(null),
      );
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve({}));
      // mock settings
      mockMethodWithResult(organizationSettingsService, 'create', [], Promise.resolve({}));
      //mock keycloak organization creation
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${orgPrifix}${payload.name}`], Promise.resolve('123'));
      //mock admin group creation to succeed
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}admin`, '123'], Promise.resolve('244'));
      //mock members group creation to succeed
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}members`, '123'], Promise.resolve());
      //mock organization owner attribute to fail
      mockMethodWithResult(
        keycloakUtil,
        'addOwnerToGroup',
        ['123', `${orgPrifix}${payload.name}`, undefined],
        Promise.resolve(),
      );
      //make adding user to keycloak admin
      mockMethodWithResult(keycloakUtil, 'addMemberToGroup', ['244', undefined], Promise.resolve());
      // mock delete group
      mockMethodWithResult(keycloakUtil, 'deleteGroup', ['123'], Promise.resolve()); // mock delete group
      // prepare base
      stub(BaseService.prototype, 'wrapEntity').returns({});
      stub(BaseService.prototype, 'create').returns(Promise.resolve({}));
      stub(MemberEvent.prototype, 'createMember').returns(Promise.reject('Failed'));

      try {
        await container.get(OrganizationService).createOrganization(payload, userId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('SOMETHING_WENT_WRONG');
      }
    });
    test('Should fail on create organization WHEN creating group member in db', async () => {
      // set organization to not exist
      mockMethodWithResult(
        organizationDAO,
        'getByCriteria',
        [
          {
            name: payload.name,
          },
        ],
        Promise.resolve(null),
      );
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve({}));
      // mock settings
      mockMethodWithResult(organizationSettingsService, 'create', [], Promise.resolve({}));
      //mock keycloak organization creation
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${orgPrifix}${payload.name}`], Promise.resolve('123'));
      //mock admin group creation to succeed
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}admin`, '123'], Promise.resolve('244'));
      //mock members group creation to succeed
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}members`, '123'], Promise.resolve('255'));
      //mock organization owner attribute to fail
      mockMethodWithResult(
        keycloakUtil,
        'addOwnerToGroup',
        ['123', `${orgPrifix}${payload.name}`, undefined],
        Promise.resolve(),
      );
      //make adding user to keycloak admin
      mockMethodWithResult(keycloakUtil, 'addMemberToGroup', ['244', undefined], Promise.resolve());
      // mock delete group
      mockMethodWithResult(keycloakUtil, 'deleteGroup', ['123'], Promise.resolve()); // mock delete group
      // prepare base
      stub(BaseService.prototype, 'wrapEntity').returns({});
      stub(BaseService.prototype, 'create').returns(Promise.resolve({})); // mock organization creation
      stub(MemberEvent.prototype, 'createMember').returns(Promise.resolve({ user: {}, organization: {} }));
      //mock admon group creation to fail
      const createGroupStub = stub(GroupEvent.prototype, 'createGroup');

      createGroupStub
        .withArgs('244', Sinon.match.any, `${grpPrifix}admin`)
        .returns(Promise.resolve({ id: 111 } as Group));

      createGroupStub.withArgs('255', Sinon.match.any, `${grpPrifix}member`).returns(Promise.reject());

      stub(GroupEvent.prototype, 'removeGroup')
        .withArgs(111)
        .returns(Promise.resolve(null as any));
      //mock delete member when foing the rollback
      stub(BaseService.prototype, 'remove').returns(Promise.resolve(null)); // mock organization creation

      try {
        await container.get(OrganizationService).createOrganization(payload, userId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('SOMETHING_WENT_WRONG');
      }
    });

    test('Should fail on create organization WHEN creating group admin in db', async () => {
      // set organization to not exist
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ name: payload.name }], Promise.resolve(null));
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve({}));
      // mock settings
      mockMethodWithResult(organizationSettingsService, 'create', [], Promise.resolve({}));
      //mock keycloak organization creation
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${orgPrifix}${payload.name}`], Promise.resolve('123'));
      //mock admin group creation to succeed
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}admin`, '123'], Promise.resolve('244'));
      //mock members group creation to succeed
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}members`, '123'], Promise.resolve('255'));
      //mock organization owner attribute to fail
      mockMethodWithResult(
        keycloakUtil,
        'addOwnerToGroup',
        ['123', `${orgPrifix}${payload.name}`, undefined],
        Promise.resolve(),
      );
      //make adding user to keycloak admin
      mockMethodWithResult(keycloakUtil, 'addMemberToGroup', ['244', undefined], Promise.resolve());
      // mock delete group
      mockMethodWithResult(keycloakUtil, 'deleteGroup', ['123'], Promise.resolve(null)); // mock delete group
      // prepare base
      stub(BaseService.prototype, 'wrapEntity').returns({});
      stub(BaseService.prototype, 'create').returns(Promise.resolve({})); // mock organization creation
      stub(MemberEvent.prototype, 'createMember').returns(Promise.resolve({ user: {}, organization: {} }));
      //mock admon group creation to fail
      const createGroupStub = stub(GroupEvent.prototype, 'createGroup');

      createGroupStub.withArgs('244', Sinon.match.any, `${grpPrifix}admin`).returns(Promise.reject('Failed'));

      createGroupStub
        .withArgs('255', Sinon.match.any, `${grpPrifix}member`)
        .returns(Promise.resolve({ id: 111 } as Group));
      //mock delete member when foing the rollback
      stub(BaseService.prototype, 'remove').returns(Promise.resolve()); // mock organization creation

      try {
        await container.get(OrganizationService).createOrganization(payload, userId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('SOMETHING_WENT_WRONG');
      }
    });
    test('Should succeed on create organization', async () => {
      // set organization to not exist
      mockMethodWithResult(
        organizationDAO,
        'getByCriteria',
        [
          {
            name: payload.name,
          },
        ],
        Promise.resolve(null),
      );
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve({}));
      // mock settings
      mockMethodWithResult(organizationSettingsService, 'create', [], Promise.resolve({}));
      //mock keycloak organization creation
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${orgPrifix}${payload.name}`], Promise.resolve('123'));
      //mock admin group creation to succeed
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}admin`, '123'], Promise.resolve('244'));
      //mock members group creation to succeed
      mockMethodWithResult(keycloakUtil, 'createGroup', [`${grpPrifix}members`, '123'], Promise.resolve('255'));
      //mock organization owner attribute to fail
      mockMethodWithResult(
        keycloakUtil,
        'addOwnerToGroup',
        ['123', `${orgPrifix}${payload.name}`, undefined],
        Promise.resolve(),
      );
      //make adding user to keycloak admin
      mockMethodWithResult(keycloakUtil, 'addMemberToGroup', ['244', undefined], Promise.resolve());
      // mock delete group
      mockMethodWithResult(keycloakUtil, 'deleteGroup', ['123'], Promise.resolve()); // mock delete group
      // prepare base
      stub(BaseService.prototype, 'wrapEntity').returns({});
      stub(BaseService.prototype, 'create').returns(
        Promise.resolve({
          id: 555,
          members: {
            add: (...args: any[]) => {
              return args;
            },
          },
        }),
      ); // mock organization creation
      stub(MemberEvent.prototype, 'createMember').returns(Promise.resolve({ user: {}, organization: {} }));
      //mock admon group creation to fail
      const createGroupStub = stub(GroupEvent.prototype, 'createGroup');

      createGroupStub
        .withArgs('244', Sinon.match.any, `${grpPrifix}admin`)
        .returns(Promise.resolve({ id: 111 } as Group));

      createGroupStub
        .withArgs('255', Sinon.match.any, `${grpPrifix}member`)
        .returns(Promise.resolve({ id: 112 } as Group));

      const result = await container.get(OrganizationService).createOrganization(payload, userId);

      expect(result).to.equal(555);
    });
  });

  suite('update Organization Generale Properties', () => {
    const userId = 1;
    const OrgId = 1;
    const kcid = 3;
    const payload: UpdateOrganizationRO = {
      name: 'testinggroundupdate',
      description: 'qsdwxcaze',
    };

    test('Should fail on organization update', async () => {
      // set organization to not exist
      mockMethodWithResult(organizationDAO, 'get', [OrgId], Promise.resolve(null));
      try {
        await container.get(OrganizationService).updateOrganizationGeneraleProperties(payload, OrgId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('ORG.NON_EXISTANT_DATA {{org}}');
      }
    });

    test('Should fail on find the direction', async () => {
      const mackPayload = { ...payload };
      mackPayload.direction = 2;
      // set organization to exist
      mockMethodWithResult(organizationDAO, 'get', [OrgId], Promise.resolve({ kcid }));
      //mock keycloak organization update
      mockMethodWithResult(
        keycloakUtil,
        'updateGroup',
        [kcid, { name: `${orgPrifix}${payload.name}` }],
        Promise.resolve(),
      );

      // set direction to null
      mockMethodWithResult(userService, 'get', [mackPayload.direction], Promise.resolve(null));

      stub(BaseService.prototype, 'wrapEntity').returns({});
      stubKeyclockInstanceWithBaseService([]);

      try {
        await container.get(OrganizationService).updateOrganizationGeneraleProperties(mackPayload, 1);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('USER.NON_EXISTANT_USER {{user}}');
      }
    });

    test('Should fail on organization parent does not existe', async () => {
      const mackPayload = { ...payload };
      mackPayload.parent = 2;

      // set organization to exist
      mockMethodWithResult(organizationDAO, 'get', [1], Promise.resolve({ kcid }));
      //mock keycloak organization update
      mockMethodWithResult(
        keycloakUtil,
        'updateGroup',
        [kcid, { name: `${orgPrifix}${payload.name}` }],
        //Promise.resolve(Result.ok('organization name updated!')),
        Promise.resolve(),
      );
      // set organization parent to null
      mockMethodWithResult(organizationDAO, 'get', [mackPayload.parent], Promise.resolve(null));
      stubKeyclockInstanceWithBaseService([]);
      stub(BaseService.prototype, 'wrapEntity').returns({});
      try {
        await container.get(OrganizationService).updateOrganizationGeneraleProperties(mackPayload, 1);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('ORG.NON_EXISTANT_PARENT_ORG');
      }
    });

    test('Should success on organization update', async () => {
      // set organization to exist
      mockMethodWithResult(organizationDAO, 'get', [OrgId], Promise.resolve({ kcid }));
      //mock keycloak organization update
      mockMethodWithResult(
        keycloakUtil,
        'updateGroup',
        [kcid, { name: `${orgPrifix}${payload.name}` }],
        //Promise.resolve(Result.ok('organization name updated!')),
        Promise.resolve(),
      );
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve({}));
      // set direction to exist
      mockMethodWithResult(userService, 'get', [payload.direction], Promise.resolve({}));
      // prepare base
      stub(BaseService.prototype, 'wrapEntity').returns({});
      stubKeyclockInstanceWithBaseService([{}]);
      mockMethodWithResult(organizationDAO, 'update', [], Promise.resolve(1));

      const result = await container.get(OrganizationService).updateOrganizationGeneraleProperties(payload, 1);

      expect(result).to.equal(1);
    });
  });

  suite('add Address To Organization', () => {
    const orgId = 1;
    const payload = {
      country: 'Canada',
      province: 'Ontario',
      code: '5L8 G9S',
      type: AddressType.ORGANIZATION,
      street: '487 Yardley Cres',
      apartment: '12',
      city: 'Ontario',
    };
    test('Should fail on organization not found', async () => {
      // check if the organization already exist
      mockMethodWithResult(organizationDAO, 'get', [orgId], Promise.resolve(null));

      try {
        await container.get(OrganizationService).addAddressToOrganization(payload, orgId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal(`ORG.NON_EXISTANT_DATA {{org}}`);
      }
    });

    test('Should fail on address creation', async () => {
      // check if the organization already exist
      mockMethodWithResult(organizationDAO, 'get', [orgId], Promise.resolve({}));
      mockMethodWithResult(addressService, 'create', [], Promise.reject(new Error('Failed')));

      try {
        await container.get(OrganizationService).addAddressToOrganization(payload, orgId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });

    test('Should success on address creation', async () => {
      // check if the organization already exist
      mockMethodWithResult(organizationDAO, 'get', [orgId], Promise.resolve({}));
      mockMethodWithResult(addressService, 'create', [], Promise.resolve({ id: 1 }));
      const result = await container.get(OrganizationService).addAddressToOrganization(payload, orgId);

      expect(result).to.equal(1);
    });
  });

  suite('add Phone To Organization', () => {
    const orgId = 1;
    const payload = {
      phoneLabel: 'personal',
      phoneCode: '+213',
      phoneNumber: '541110222',
    } as any;
    test('Should fail on organization not found', async () => {
      mockMethodWithResult(organizationDAO, 'get', [orgId], Promise.resolve(null));

      try {
        await container.get(OrganizationService).addPhoneToOrganization(payload, orgId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('ORG.NON_EXISTANT_DATA {{org}}');
      }
    });

    test('Should fail on phone creation', async () => {
      mockMethodWithResult(organizationDAO, 'get', [orgId], Promise.resolve(null));

      try {
        await container.get(OrganizationService).addPhoneToOrganization(payload, orgId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('ORG.NON_EXISTANT_DATA {{org}}');
      }
    });

    test('Should success on phone creation', async () => {
      mockMethodWithResult(organizationDAO, 'get', [orgId], Promise.resolve({}));
      mockMethodWithResult(phoneService, 'create', [], Promise.resolve({ id: 1 }));
      const result = await container.get(OrganizationService).addPhoneToOrganization(payload, orgId);

      expect(result).to.equal(1);
    });
  });

  suite('get member', () => {
    const orgId = 1;
    test('Should fail on organization not found', async () => {
      // check if the organization already exist
      mockMethodWithResult(organizationDAO, 'get', [orgId], Promise.resolve(null));
      try {
        await container.get(OrganizationService).getMembers(orgId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal(`ORG.NON_EXISTANT_DATA {{org}}`);
      }
    });
    test('Should return collection of members', async () => {
      mockMethodWithResult(
        organizationDAO,
        'get',
        [orgId],
        Promise.resolve({ members: new Collection<Member>(Member, []) }),
      );

      const members = await container.get(OrganizationService).getMembers(orgId);
      expect(members).to.have.length(0);
    });
  });
});
