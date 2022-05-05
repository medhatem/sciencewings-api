import intern from 'intern';
import { stub, restore, SinonStubbedInstance, createStubInstance } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { container } from '@/di';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { OrganizationService } from '@/modules/organizations/services/OrganizationService';
import { OrganizationRoutes } from '@/modules/organizations/routes/OrganizationRoutes';
import { LocalStorage } from '@/utils/LocalStorage';
import { mockMethodWithResult } from '@/utils/utilities';
import { CreateOrganizationRO, UpdateOrganizationRO } from '@/modules/organizations/routes/RequestObject';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { AddressRO } from '@/modules/address/routes/AddressRO';
import { Result } from '@/utils/Result';
import { AddressType } from '@/modules/address/models/Address';

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

  test('should create the right instance', () => {
    const instance = OrganizationRoutes.getInstance();
    expect(instance instanceof OrganizationRoutes);
  });
  suite('POST organization/createOrganization', () => {
    const payload: CreateOrganizationRO = {
      name: 'test',
      description: 'test',
      email: 'test',
      phones: {} as PhoneRO[],
      type: 'test',
      addresses: {} as AddressRO[],
      labels: ['0'],
      members: [1],
      direction: 1,
      socialFacebook: 'test',
      socialTwitter: 'test',
      socialGithub: 'test',
      socialLinkedin: 'test',
      socialYoutube: 'test',
      socialInstagram: 'test',
      adminContact: 1,
      parentId: 1,
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
    const payload: PhoneRO = {
      phoneLabel: 'test',
      phoneCode: 'test',
      phoneNumber: 'test',
      userId: 1,
      organizationId: 1,
      memberId: 1,
    };

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
  /*  
  suite('PUT update/:id', () => {
    const payload: ResourceRO = {
      name: 'resource_dash_one',
      description: 'string',
      active: true,
      resourceType: 'USER',
      resourceClass: 'TECH',
      timezone: 'gmt+1',
      tags: [],
      organization: 1,
      user: 1,
    };

    test('Should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'updateResource',
        [payload],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await resourceRoute.updateResource(payload, 1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('Should success at updating and returning the right value', async () => {
      mockMethodWithResult(resourceService, 'updateResource', [payload], Result.ok(1));
      const result = await resourceRoute.updateResource(payload, 1);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(204);
    });
  });
  suite('GET getOgranizationResourcesById/:organizationId', () => {
    test('Should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'getResourcesOfAGivenOrganizationById',
        [1],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await resourceRoute.getOgranizationResources(1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('Should success at eturning the right value', async () => {
      mockMethodWithResult(resourceService, 'getResourcesOfAGivenOrganizationById', [], Result.ok([] as Resource[]));
      const result = await resourceRoute.getOgranizationResources(1);
      expect(result.body.statusCode).to.equal(200);
    });
  });
  suite('PUT settings/reservation/general/:resourceId', () => {
    const payload: ResourcesSettingsReservationGeneralRO = {
      isEnabled: true,
      isLoanable: true,
      isReturnTheirOwnLoans: true,
      isReservingLoansAtFutureDates: true,
      fixedLoanDuration: 'test',
      overdueNoticeDelay: 'test',
      recurringReservations: 'test',
    };

    test('Should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'updateResourceReservationGeneral',
        [payload],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await resourceRoute.updateResourcesSettingsReservationGeneral(payload, 1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('Should success at updating and returning the right value', async () => {
      mockMethodWithResult(resourceService, 'updateResourceReservationGeneral', [payload], Result.ok(1));
      const result = await resourceRoute.updateResourcesSettingsReservationGeneral(payload, 1);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(204);
    });
  });
  suite('GET settings/reservation/rate/:resourceId', () => {
    test('Should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'getResourceRate',
        [1],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await resourceRoute.getResourceRate(1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('Should success at eturning the right value', async () => {
      mockMethodWithResult(resourceService, 'getResourceRate', [], Result.ok([] as Resource[]));
      const result = await resourceRoute.getResourceRate(1);
      expect(result.body.statusCode).to.equal(200);
    });
  }); */
});
