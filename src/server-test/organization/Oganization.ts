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
import { OrganisationLabelService } from '@/modules/organizations/services/OrganizationLabelService';
import { AddressType } from '@/modules/address/models/Address';
import { container } from '@/di';
import { Email } from '@/utils/Email';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { CreateOrganizationRO } from '@/modules/organizations/routes/RequestObject';
import { BaseService } from '@/modules/base/services/BaseService';
import Sinon = require('sinon');

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let baseService: SinonStubbedInstance<BaseService<any>>;
  let organizationDAO: SinonStubbedInstance<OrganizationDao>;
  let organizationService: SinonStubbedInstance<OrganizationService>;
  let userService: SinonStubbedInstance<UserService>;
  let emailService: SinonStubbedInstance<Email>;
  let addressService: SinonStubbedInstance<AddressService>;
  let phoneService: SinonStubbedInstance<PhoneService>;
  let labelService: SinonStubbedInstance<OrganisationLabelService>;

  const mockMethodWithResult = (
    className: SinonStubbedInstance<any>,
    methodToStub: any,
    args: any,
    returnValue: any,
  ) => {
    className[methodToStub].withArgs(...args).returns(returnValue);
  };

  beforeEach(() => {
    createStubInstance(Configuration);
    baseService = createStubInstance(BaseService);
    organizationDAO = createStubInstance(OrganizationDao);
    organizationService = createStubInstance(OrganizationService);
    userService = createStubInstance(UserService);
    emailService = createStubInstance(Email);
    addressService = createStubInstance(AddressService);
    phoneService = createStubInstance(PhoneService);
    labelService = createStubInstance(OrganisationLabelService);

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
      .withArgs(OrganizationService)
      .returns(
        new OrganizationService(organizationDAO, userService, labelService, addressService, phoneService, emailService),
      );
  });

  afterEach(() => {
    restore();
  });

  test('should create the right instance', () => {
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

    test('should fail on organization already existe', async () => {
      // set organization to not exist
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ name: payload.name }], Promise.resolve({}));
      const result = await container.get(OrganizationService).createOrganization(payload, userId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Organization ${payload.name} already exist.`);
    });

    test('should fail on organization parent does not existe', async () => {
      // set organization to not exist
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ name: payload.name }], Promise.resolve(null));
      // set organization parent to null
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ id: payload.parentId }], Promise.resolve(null));
      payload.parentId = '1';
      const result = await container.get(OrganizationService).createOrganization(payload, userId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Organization parent does not exist`);

      delete payload.parentId;
    });

    test('should fail on find the owner', async () => {
      // set organization to not exist
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ name: payload.name }], Promise.resolve(null));
      // set owner to null
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve(Result.ok(null)));
      const result = await container.get(OrganizationService).createOrganization(payload, userId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`User with id: ${userId} does not exist`);
    });

    test('should fail on find the adminContact', async () => {
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

    test('should fail on find the direction', async () => {
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

    test('should fail on organization creation', async () => {
      // set organization to not exist
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ name: payload.name }], Promise.resolve(null));
      // set owner to exist
      mockMethodWithResult(userService, 'get', [userId], Promise.resolve(Result.ok({})));
      // set adminContact to exist
      mockMethodWithResult(userService, 'get', [payload.adminContact], Promise.resolve(Result.ok({})));
      // set direction to exist
      mockMethodWithResult(userService, 'get', [payload.direction], Promise.resolve(Result.ok({})));

      mockMethodWithResult(organizationService, 'wrapEntity', [], Promise.resolve({}));
      mockMethodWithResult(baseService, 'wrapEntity', [], Promise.resolve({}));
      // error during organization creation
      mockMethodWithResult(baseService, 'create', [Sinon.match.any], Promise.resolve(Result.fail('stackTrace')));

      const result = await container.get(OrganizationService).createOrganization(payload, userId);
      console.log({ result });

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal('stackTrace');
    });
  });

  suite('get member', () => {
    const orgId = 1;
    test('should fail on organization not found', async () => {
      // check if the organization already exist
      mockMethodWithResult(organizationDAO, 'get', [orgId], Promise.resolve(null));
      const result = await container.get(OrganizationService).getMembers(orgId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Organization with id ${orgId} does not exist.`);
    });
    test('should return collection of members', async () => {
      mockMethodWithResult(organizationDAO, 'get', [orgId], Promise.resolve({ members: [] }));
      const result = await container.get(OrganizationService).getMembers(orgId);
      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.eql([]);
    });
  });

  suite('get user organizations', () => {
    const userId = 1;
    test('should return array of organization', async () => {
      mockMethodWithResult(organizationDAO, 'getByCriteria', [{ owner: userId }], Promise.resolve([]));
      const result = await container.get(OrganizationService).getUserOrganizations(userId);
      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.eql([]);
    });
  });
});
