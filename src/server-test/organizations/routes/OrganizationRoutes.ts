import { CreateOrganizationRO, UpdateOrganizationRO } from '@/modules/organizations/routes/RequestObject';
import { SinonStubbedInstance, createStubInstance, restore, stub } from 'sinon';
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';

import { AddressRO } from '@/modules/address/routes/AddressRO';
import { AddressType } from '@/modules/address/models/Address';
import { Configuration } from '@/configuration/Configuration';
import { LocalStorage } from '@/utils/LocalStorage';
import { Logger } from '@/utils/Logger';
import { OrganizationRoutes } from '@/modules/organizations/routes/OrganizationRoutes';
import { OrganizationService } from '@/modules/organizations/services/OrganizationService';
import { OrganizationType } from '@/modules/organizations/models/Organization';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { Result } from '@/utils/Result';
import { container } from '@/di';
import intern from 'intern';
import { mockMethodWithResult } from '@/utils/utilities';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let organizationService: SinonStubbedInstance<OrganizationService>;
  let organizationRoutes: OrganizationRoutes;
  beforeEach(() => {
    createStubInstance(Configuration);
    organizationService = createStubInstance(OrganizationService);
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
    mockedContainer.withArgs(OrganizationRoutes).returns(new OrganizationRoutes(organizationService));
    organizationRoutes = container.get(OrganizationRoutes);
  });

  afterEach(() => {
    restore();
  });

  test('Should create the right instance', () => {
    const instance = OrganizationRoutes.getInstance();
    expect(instance instanceof OrganizationRoutes);
  });
  suite('POST organization/createOrganization', () => {
    const payload: CreateOrganizationRO = {
      name: 'test',
      email: 'test',
      phones: {} as PhoneRO[],
      addresses: {} as AddressRO[],
      labels: ['0'],
      type: OrganizationType.SERVICE,
      members: [1],
      direction: 1,
      socialFacebook: 'test',
      socialTwitter: 'test',
      socialGithub: 'test',
      socialLinkedin: 'test',
      socialYoutube: 'test',
      socialInstagram: 'test',
      adminContact: 1,
      parent: 1,
    };
    const request = {
      userId: 1,
    };
    test('Should fail on throw error', async () => {
      mockMethodWithResult(
        organizationService,
        'createOrganization',
        [payload, request.userId],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await organizationRoutes.createOrganization(payload, request as any);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('Should success at returning the right value', async () => {
      mockMethodWithResult(organizationService, 'createOrganization', [payload, request.userId], Result.ok(1));
      const result = await organizationRoutes.createOrganization(payload, request as any);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(201);
    });
  });
  suite('PUT organization/updateOrganization/:id', () => {
    const payload: UpdateOrganizationRO = {
      name: 'test',
      description: 'test',
      email: 'test',
      type: 'test',
      labels: [''],
      direction: 1,
      socialFacebook: 'test',
      socialTwitter: 'test',
      socialGithub: 'test',
      socialLinkedin: 'test',
      socialYoutube: 'test',
      socialInstagram: 'test',
      adminContact: 1,
      parent: 1,
    };

    test('Should fail on throw error', async () => {
      mockMethodWithResult(
        organizationService,
        'updateOrganizationGeneraleProperties',
        [payload],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await organizationRoutes.updateOrganization(payload, 1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('Should success at updating and returning the right value', async () => {
      mockMethodWithResult(organizationService, 'updateOrganizationGeneraleProperties', [payload], Result.ok(1));
      const result = await organizationRoutes.updateOrganization(payload, 1);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(204);
    });
  });
  suite('POST organization/phone/:id', () => {
    const payload = {
      phoneLabel: 'test',
      phoneCode: 'test',
      phoneNumber: 'test',
      userId: 1,
      organizationId: 1,
      memberId: 1,
    } as any;

    test('Should fail on throw error', async () => {
      mockMethodWithResult(
        organizationService,
        'addPhoneToOrganization',
        [payload, 1],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await organizationRoutes.CreateOrganizationPhone(payload, 1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('Should success at returning the right value', async () => {
      mockMethodWithResult(organizationService, 'addPhoneToOrganization', [payload, 1], Result.ok(1));
      const result = await organizationRoutes.CreateOrganizationPhone(payload, 1);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(204);
    });
  });
  suite('POST organization/address/:id', () => {
    const payload: AddressRO = {
      country: 'test',
      province: 'test',
      code: 'test',
      type: AddressType.USER,
      city: 'test',
      street: 'test',
      apartment: 'test',
      user: 1,
      organization: 1,
    };

    test('Should fail on throw error', async () => {
      mockMethodWithResult(
        organizationService,
        'addAddressToOrganization',
        [payload, 1],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await organizationRoutes.CreateOrganizationAdress(payload, 1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('Should success at returning the right value', async () => {
      mockMethodWithResult(organizationService, 'addAddressToOrganization', [payload, 1], Result.ok(1));
      const result = await organizationRoutes.CreateOrganizationAdress(payload, 1);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(204);
    });
  });
  suite('GET organization/getMembers/:id', () => {
    test('Should fail on throw error', async () => {
      mockMethodWithResult(
        organizationService,
        'getMembers',
        [1],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await organizationRoutes.getUsers(1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('Should success at eturning the right value', async () => {
      mockMethodWithResult(organizationService, 'getMembers', [], Result.ok([{}]));
      const result = await organizationRoutes.getUsers(1);
      expect(result.body.statusCode).to.equal(200);
    });
  });
  suite('GET gorganization/getUserOrganizations/:id', () => {
    test('Should fail on throw error', async () => {
      mockMethodWithResult(
        organizationService,
        'getUserOrganizations',
        [1],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await organizationRoutes.getUserOrganizations(1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('Should success at eturning the right value', async () => {
      mockMethodWithResult(organizationService, 'getUserOrganizations', [], Result.ok(1));
      const result = await organizationRoutes.getUserOrganizations(1);
      expect(result.body.statusCode).to.equal(200);
    });
  });
});
