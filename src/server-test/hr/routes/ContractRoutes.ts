import { SinonStubbedInstance, createStubInstance, restore, stub } from 'sinon';
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';

import { Configuration } from '@/configuration/Configuration';
import { CreateContractRO } from '@/modules/hr/routes/RequestObject';
import { ContractRoutes } from '@/modules/hr/routes/ContractRoutes';
import { ContractService } from '@/modules/hr/services/ContractService';
import { LocalStorage } from '@/utils/LocalStorage';
import { Logger } from '@/utils/Logger';
import { container } from '@/di';
import intern from 'intern';
import { mockMethodWithResult } from '@/utils/utilities';

const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let contractService: SinonStubbedInstance<ContractService>;
  let contractRoutes: ContractRoutes;
  beforeEach(() => {
    createStubInstance(Configuration);
    contractService = createStubInstance(ContractService);
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
    mockedContainer.withArgs(ContractRoutes).returns(new ContractRoutes(contractService));
    contractRoutes = container.get(ContractRoutes);
  });

  afterEach(() => {
    restore();
  });

  test('Should create the right instance', () => {
    const instance = ContractRoutes.getInstance();
    expect(instance instanceof ContractRoutes);
  });
  suite('POST contracts/create', () => {
    const payload = new CreateContractRO();

    test('Should fail on throw error', async () => {
      mockMethodWithResult(
        contractService,
        'createContract',
        [payload],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await contractRoutes.createContract(payload);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('Should success at returning the right value', async () => {
      mockMethodWithResult(contractService, 'createContract', [payload], 1);
      const result = await contractRoutes.createContract(payload);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(201);
    });
  });

  suite('PUT contracts/update/:id', () => {
    const payload = new CreateContractRO();

    test('Should fail on throw error', async () => {
      mockMethodWithResult(contractService, 'updateContract', [payload], Promise.reject(new Error('Failed')));
      try {
        await contractRoutes.createUpdateContract(payload, 1);
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should success at updating and returning the right value', async () => {
      mockMethodWithResult(contractService, 'updateContract', [payload], 1);
      const result = await contractRoutes.createUpdateContract(payload, 1);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(204);
    });
  });
  /* 
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
  }); */
  /*  
  suite('PUT update/:id', () => {
    const payload: ResourceRO = {
      name: 'resource_dash_one',
      description: 'string',
      active: true,
      statusType: 'USER',
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
  suite('GET getOrganizationResourcesById/:organizationId', () => {
    test('Should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'getResourcesOfAGivenOrganizationById',
        [1],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await resourceRoute.getOrganizationResources(1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('Should success at eturning the right value', async () => {
      mockMethodWithResult(resourceService, 'getResourcesOfAGivenOrganizationById', [], Result.ok([] as Resource[]));
      const result = await resourceRoute.getOrganizationResources(1);
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
