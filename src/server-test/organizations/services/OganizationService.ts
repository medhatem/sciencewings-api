import intern from 'intern';
import { stub, createStubInstance, SinonStubbedInstance, restore } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { AddressService } from '@/modules/address/services/AddressService';
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { Result } from '@/utils/Result';
import { OrganizationDao } from '@/modules/organizations/daos/OrganizationDao';
import { UserService } from '@/modules/users/services/UserService';
import { PhoneService } from '@/modules/phones/services/PhoneService';
import { OrganizationService } from '@/modules/organizations/services/OrganizationService';
import { OrganizationLabelService } from '@/modules/organizations/services/OrganizationLabelService';
import { AddressType } from '@/modules/address/models/Address';
import { container } from '@/di';
import { Email } from '@/utils/Email';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { CreateOrganizationRO, UpdateOrganizationRO } from '@/modules/organizations/routes/RequestObject';
import { BaseService } from '@/modules/base/services/BaseService';
import { mockMethodWithResult } from '@/utils/utilities';
import { MemberEvent } from '@/modules/hr/events/MemberEvent';
import { GroupEvent } from '@/modules/hr/events/GroupEvent';
import { Keycloak } from '@/sdks/keycloak';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let organizationDAO: SinonStubbedInstance<OrganizationDao>;
  let userService: SinonStubbedInstance<UserService>;
  let emailService: SinonStubbedInstance<Email>;
  let addressService: SinonStubbedInstance<AddressService>;
  let phoneService: SinonStubbedInstance<PhoneService>;
  let labelService: SinonStubbedInstance<OrganizationLabelService>;
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
          userService,
          labelService,
          addressService,
          phoneService,
          emailService,
          Keycloak.getInstance(),
        ),
      );
  }

  beforeEach(() => {
    createStubInstance(Configuration);
    organizationDAO = createStubInstance(OrganizationDao);
    userService = createStubInstance(UserService);
    emailService = createStubInstance(Email);
    addressService = createStubInstance(AddressService);
    phoneService = createStubInstance(PhoneService);
    labelService = createStubInstance(OrganizationLabelService);

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
          userService,
          labelService,
          addressService,
          phoneService,
          emailService,
          Keycloak.getInstance(),
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
      description: '',
      email: 'testingground1@gmail.com',
      phones: [
        {
          phoneLabel: 'personal',
          phoneCode: '+213',
          phoneNumber: '541110222',
        },
      ],
      type: 'Public',
      labels: ['x', 'y', 'z'],
      members: [] as any,
      direction: 1,
      adminContact: 1,
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

    test('Should fail on organization already existe', async () => {
      // set organization to not exist
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ name: payload.name }], Promise.resolve({}));
      const result = await container.get(OrganizationService).createOrganization(payload, userId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Organization ${payload.name} already exist.`);
    });

    test('Should fail on organization parent does not existe', async () => {
      // set organization to not exist
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ name: payload.name }], Promise.resolve(null));
      // set organization parent to null
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ id: payload.parent }], Promise.resolve(null));
      payload.parent = 1;
      const result = await container.get(OrganizationService).createOrganization(payload, userId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Organization parent with id ${payload.parent} does not exist`);

      delete payload.parent;
    });

    test('Should fail on find the owner', async () => {
      // set organization to not exist
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ name: payload.name }], Promise.resolve(null));
      // set owner to null
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve(Result.ok(null)));
      const result = await container.get(OrganizationService).createOrganization(payload, userId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`User with id: ${userId} does not exist`);
    });

    test('Should fail on find the adminContact', async () => {
      // set organization to not exist
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ name: payload.name }], Promise.resolve(null));
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve(Result.ok({})));
      // set adminContact to null
      payload.adminContact = 2;
      mockMethodWithResult(userService, 'get', [payload.adminContact], Promise.resolve(Result.ok(null)));

      const result = await container.get(OrganizationService).createOrganization(payload, userId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`User with id: ${payload.adminContact} does not exist.`);

      payload.adminContact = 1;
    });

    test('Should fail on find the direction', async () => {
      // set organization to not exist
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ name: payload.name }], Promise.resolve(null));
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve(Result.ok({})));
      // set adminContact to exist
      mockMethodWithResult(userService, 'get', [payload.adminContact], Promise.resolve(Result.ok({})));
      // set direction to null
      payload.direction = 2;
      mockMethodWithResult(userService, 'get', [payload.direction], Promise.resolve(Result.ok(null)));

      const result = await container.get(OrganizationService).createOrganization(payload, userId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`User with id: ${payload.direction} does not exist.`);

      payload.direction = 1;
    });

    test('Should fail on organization creation', async () => {
      // set organization to not exist
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ name: payload.name }], Promise.resolve(null));
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve(Result.ok({})));
      // set adminContact to exist
      mockMethodWithResult(userService, 'get', [payload.adminContact], Promise.resolve(Result.ok({})));
      // set direction to exist
      mockMethodWithResult(userService, 'get', [payload.direction], Promise.resolve(Result.ok({})));
      // prepare base
      stub(BaseService.prototype, 'wrapEntity').returns({});
      stub(BaseService.prototype, 'create').resolves(Result.fail('stackTrace'));
      stubKeyclockInstanceWithBaseService([]);

      const result = await container.get(OrganizationService).createOrganization(payload, userId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal('stackTrace');
    });

    test('Should success on organization creation', async () => {
      // set organization to not exist
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ name: payload.name }], Promise.resolve(null));

      // mockMethodWithResult(organizationDAO., 'repository', [], { flush: stub() });
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve(Result.ok({})));
      // set adminContact to exist
      mockMethodWithResult(userService, 'get', [payload.adminContact], Promise.resolve(Result.ok({})));
      // set direction to exist
      mockMethodWithResult(userService, 'get', [payload.direction], Promise.resolve(Result.ok({})));
      // prepare base
      organizationDAO['repository'] = { flush: stub() } as any;
      stub(BaseService.prototype, 'wrapEntity').returns({});
      stub(BaseService.prototype, 'create').resolves(Result.ok({ id: 1 }));
      stubKeyclockInstanceWithBaseService([{}]);

      // set member creation
      stub(MemberEvent.prototype, 'createMember').returns({} as any);
      stub(GroupEvent.prototype, 'createGroup').returns({} as any);
      // set address creation
      mockMethodWithResult(addressService, 'create', [], Promise.resolve(Result.ok({})));
      mockMethodWithResult(addressService, 'wrapEntity', [], Promise.resolve({ organization: {} }));
      // set phone creation
      mockMethodWithResult(phoneService, 'create', [], Promise.resolve(Result.ok({})));
      mockMethodWithResult(phoneService, 'wrapEntity', [], Promise.resolve({ organization: {} }));
      // set label creation
      mockMethodWithResult(labelService, 'createBulkLabel', [], Promise.resolve(Result.ok({})));

      const result = await container.get(OrganizationService).createOrganization(payload, userId);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.equal(1);
    });
  });

  suite('update Organization Generale Properties', () => {
    const userId = 1;
    const payload: UpdateOrganizationRO = {
      name: 'testinggroundupdate',
      description: 'qsdwxcaze',
    };

    test('Should fail on organization update', async () => {
      // set organization to not exist
      mockMethodWithResult(organizationDAO, 'get', [1], Promise.resolve(null));
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve(Result.ok({})));
      // set adminContact to exist
      mockMethodWithResult(userService, 'get', [payload.adminContact], Promise.resolve(Result.ok({})));
      // set direction to exist
      mockMethodWithResult(userService, 'get', [payload.direction], Promise.resolve(Result.ok({})));
      // prepare base
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(organizationDAO, 'update', [], Promise.resolve(1));

      const result = await container.get(OrganizationService).updateOrganizationGeneraleProperties(payload, 1);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Organization with id 1 does not exist.`);
    });

    test('Should fail on find the adminContact', async () => {
      const mackPayload = { ...payload };
      mackPayload.adminContact = 2;
      // set organization to exist
      mockMethodWithResult(organizationDAO, 'get', [], Promise.resolve({}));
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve(Result.ok({})));
      // set adminContact to null
      mockMethodWithResult(userService, 'get', [mackPayload.adminContact], Promise.resolve(Result.ok(null)));

      stub(BaseService.prototype, 'wrapEntity').returns({});
      stubKeyclockInstanceWithBaseService([]);

      const result = await container.get(OrganizationService).updateOrganizationGeneraleProperties(mackPayload, 1);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`User with id: ${mackPayload.adminContact} does not exist.`);
    });

    test('Should fail on find the direction', async () => {
      const mackPayload = { ...payload };
      mackPayload.direction = 2;
      // set organization to exist
      mockMethodWithResult(organizationDAO, 'get', [], Promise.resolve({}));
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve(Result.ok({})));
      // set adminContact to exist
      mockMethodWithResult(userService, 'get', [mackPayload.adminContact], Promise.resolve(Result.ok({})));
      // set direction to null
      mockMethodWithResult(userService, 'get', [mackPayload.direction], Promise.resolve(Result.ok(null)));

      stub(BaseService.prototype, 'wrapEntity').returns({});
      stubKeyclockInstanceWithBaseService([]);

      const result = await container.get(OrganizationService).updateOrganizationGeneraleProperties(mackPayload, 1);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`User with id: ${mackPayload.direction} does not exist.`);
    });

    test('Should fail on organization parent does not existe', async () => {
      const mackPayload = { ...payload };
      mackPayload.parent = 2;

      // set organization to exist
      mockMethodWithResult(organizationDAO, 'get', [1], Promise.resolve({}));
      // set organization parent to null
      mockMethodWithResult(organizationDAO, 'get', [2], Promise.resolve(null));
      stubKeyclockInstanceWithBaseService([]);
      stub(BaseService.prototype, 'wrapEntity').returns({});
      const result = await container.get(OrganizationService).updateOrganizationGeneraleProperties(mackPayload, 1);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Organization parent with id: ${mackPayload.parent} does not exist.`);
    });

    test('Should success on organization update', async () => {
      // set organization to exist
      mockMethodWithResult(organizationDAO, 'get', [1], Promise.resolve({}));
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve(Result.ok({})));
      // set adminContact to exist
      mockMethodWithResult(userService, 'get', [payload.adminContact], Promise.resolve(Result.ok({})));
      // set direction to exist
      mockMethodWithResult(userService, 'get', [payload.direction], Promise.resolve(Result.ok({})));
      // prepare base
      stub(BaseService.prototype, 'wrapEntity').returns({});
      stubKeyclockInstanceWithBaseService([{}]);
      mockMethodWithResult(organizationDAO, 'update', [], Promise.resolve(1));

      const result = await container.get(OrganizationService).updateOrganizationGeneraleProperties(payload, 1);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.equal(1);
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
      const result = await container.get(OrganizationService).addAddressToOrganization(payload, orgId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`organization with id ${orgId} does not exist.`);
    });

    test('Should fail on address creation', async () => {
      // check if the organization already exist
      mockMethodWithResult(organizationDAO, 'get', [orgId], Promise.resolve({}));
      mockMethodWithResult(addressService, 'create', [], Promise.resolve(Result.fail('StackTrace')));
      const result = await container.get(OrganizationService).addAddressToOrganization(payload, orgId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`fail to create address`);
    });

    test('Should success on address creation', async () => {
      // check if the organization already exist
      mockMethodWithResult(organizationDAO, 'get', [orgId], Promise.resolve({}));
      mockMethodWithResult(addressService, 'create', [], Promise.resolve(Result.ok({ id: 1 })));
      const result = await container.get(OrganizationService).addAddressToOrganization(payload, orgId);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.equal(1);
    });
  });

  suite('add Phone To Organization', () => {
    const orgId = 1;
    const payload = {
      phoneLabel: 'personal',
      phoneCode: '+213',
      phoneNumber: '541110222',
    };
    test('Should fail on organization not found', async () => {
      mockMethodWithResult(organizationDAO, 'get', [orgId], Promise.resolve(null));
      const result = await container.get(OrganizationService).addPhoneToOrganization(payload, orgId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`organization with id ${orgId} does not exist.`);
    });

    test('Should fail on phone creation', async () => {
      mockMethodWithResult(organizationDAO, 'get', [orgId], Promise.resolve({}));
      mockMethodWithResult(phoneService, 'create', [], Promise.resolve(Result.fail('StackTrace')));
      const result = await container.get(OrganizationService).addPhoneToOrganization(payload, orgId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`fail to create new phone.`);
    });

    test('Should success on phone creation', async () => {
      mockMethodWithResult(organizationDAO, 'get', [orgId], Promise.resolve({}));
      mockMethodWithResult(phoneService, 'create', [], Promise.resolve(Result.ok({ id: 1 })));
      const result = await container.get(OrganizationService).addPhoneToOrganization(payload, orgId);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.equal(1);
    });
  });

  suite('get member', () => {
    const orgId = 1;
    test('Should fail on organization not found', async () => {
      // check if the organization already exist
      mockMethodWithResult(organizationDAO, 'get', [orgId], Promise.resolve(null));
      const result = await container.get(OrganizationService).getMembers(orgId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Organization with id ${orgId} does not exist.`);
    });
    test('Should return collection of members', async () => {
      mockMethodWithResult(organizationDAO, 'get', [orgId], Promise.resolve({ members: [] }));
      const result = await container.get(OrganizationService).getMembers(orgId);
      expect(result.isSuccess).to.be.true;
    });
  });

  suite('get user organizations', () => {
    const userId = 1;
    test('Should return array of organization', async () => {
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ owner: userId }], Promise.resolve([]));
      const result = await container.get(OrganizationService).getUserOrganizations(userId);
      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.eql([]);
    });
  });
});
