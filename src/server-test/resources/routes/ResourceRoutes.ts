import intern from 'intern';
import { stub, restore, SinonStubbedInstance, createStubInstance } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { container } from '@/di';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { ResourceService } from '@/modules/resources/services/ResourceService';
import { ResourceRoutes } from '@/modules/resources/routes/ResourceRoutes';
import { mockMethodWithResult } from '@/utils/utilities';
import {
  ResourceRateRO,
  ResourceReservationVisibilityRO,
  ResourceRO,
  ResourceSettingsGeneralPropertiesRO,
  ResourceSettingsGeneralStatusRO,
  ResourceSettingsGeneralVisibilityRO,
  ResourcesSettingsReservationGeneralRO,
  ResourcesSettingsReservationUnitRO,
  ResourceTimerRestrictionRO,
} from '@/modules/resources/routes/RequestObject';
import { Result } from '@/utils/Result';
import { Resource } from '@/modules/resources';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let resourceService: SinonStubbedInstance<ResourceService>;

  beforeEach(() => {
    createStubInstance(Configuration);
    resourceService = createStubInstance(ResourceService);

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
    mockedContainer.withArgs(ResourceRoutes).returns(new ResourceRoutes(resourceService));
  });

  afterEach(() => {
    restore();
  });

  test('should create the right instance', () => {
    const instance = ResourceRoutes.getInstance();
    expect(instance instanceof ResourceRoutes);
  });
  suite('POST resources/create', () => {
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

    test('route should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'createResource',
        [payload],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await container.get(ResourceRoutes).createResource(payload);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('route should success at returning the right value', async () => {
      mockMethodWithResult(resourceService, 'createResource', [payload], Result.ok(1));
      const result = await container.get(ResourceRoutes).createResource(payload);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(201);
    });
  });
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

    test('route should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'updateResource',
        [payload],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await container.get(ResourceRoutes).updateResource(payload, 1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('route should success at updating and returning the right value', async () => {
      mockMethodWithResult(resourceService, 'updateResource', [payload], Result.ok(1));
      const result = await container.get(ResourceRoutes).updateResource(payload, 1);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(204);
    });
  });
  suite('GET getOgranizationResourcesById/:organizationId', () => {
    test('route should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'getResourcesOfAGivenOrganizationById',
        [1],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await container.get(ResourceRoutes).getOgranizationResources(1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('route should success at eturning the right value', async () => {
      mockMethodWithResult(resourceService, 'getResourcesOfAGivenOrganizationById', [], Result.ok([] as Resource[]));
      const result = await container.get(ResourceRoutes).getOgranizationResources(1);
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

    test('route should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'updateResourceReservationGeneral',
        [payload],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await container.get(ResourceRoutes).updateResourcesSettingsReservationGeneral(payload, 1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('route should success at updating and returning the right value', async () => {
      mockMethodWithResult(resourceService, 'updateResourceReservationGeneral', [payload], Result.ok(1));
      const result = await container.get(ResourceRoutes).updateResourcesSettingsReservationGeneral(payload, 1);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(204);
    });
  });
  suite('PUT settings/general/status/:resourceId', () => {
    const payload: ResourceSettingsGeneralStatusRO = {
      statusType: 'OPERZTIONAL',
      statusDescription: 'test',
    };

    test('route should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'updateResourcesSettingsGeneralStatus',
        [payload],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await container.get(ResourceRoutes).updateResourcesSettingsGeneralStatus(payload, 1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('route should success at updating and returning the right value', async () => {
      mockMethodWithResult(resourceService, 'updateResourcesSettingsGeneralStatus', [payload], Result.ok(1));
      const result = await container.get(ResourceRoutes).updateResourcesSettingsGeneralStatus(payload, 1);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(204);
    });
  });
  suite('PUT settings/reservation/unit/:resourceId', () => {
    const payload: ResourcesSettingsReservationUnitRO = {
      unitLimit: 2,
      unitName: 'aze',
      unites: 0,
    };

    test('route should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'updateResourceReservationUnits',
        [payload],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await container.get(ResourceRoutes).updateResourcesSettingsReservationUnit(payload, 1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('route should success at updating and returning the right value', async () => {
      mockMethodWithResult(resourceService, 'updateResourceReservationUnits', [payload], Result.ok(1));
      const result = await container.get(ResourceRoutes).updateResourcesSettingsReservationUnit(payload, 1);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(204);
    });
  });
  suite('PUT settings/general/visibility/:resourceId', () => {
    const payload: ResourceSettingsGeneralVisibilityRO = {
      visibility: true,
      isUnlistedOnOrganizationPage: true,
      isUnlistedToUsersWhoCannotReserve: true,
      isFullyHiddentoUsersWhoCannotReserve: true,
      isPromotedOnSitePageAsALargeButtonAboveOtherResources: true,
      isHideAvailabilityonSitePage: true,
    };
    test('route should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'updateResourcesSettingsGeneralVisibility',
        [payload],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await container.get(ResourceRoutes).updateResourcesSettingsGeneralVisibility(payload, 1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('route should success at updating and returning the right value', async () => {
      mockMethodWithResult(resourceService, 'updateResourcesSettingsGeneralVisibility', [payload], Result.ok(1));
      const result = await container.get(ResourceRoutes).updateResourcesSettingsGeneralVisibility(payload, 1);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(204);
    });
  });
  suite('GET settings/reservation/rate/:resourceId', () => {
    test('route should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'getResourceRate',
        [1],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await container.get(ResourceRoutes).getResourceRate(1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('route should success at eturning the right value', async () => {
      mockMethodWithResult(resourceService, 'getResourceRate', [], Result.ok([] as Resource[]));
      const result = await container.get(ResourceRoutes).getResourceRate(1);
      expect(result.body.statusCode).to.equal(200);
    });
  });
  suite('POST settings/reservation/rate/:resourceId', () => {
    const payload: ResourceRateRO = {
      description: 'test',
      rate: 2,
      category: 'test',
      isPublic: true,
      isRequiredAccountNumber: true,
      duration: 2,
    };

    test('route should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'createResourceRate',
        [payload],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await container.get(ResourceRoutes).createResourceRate(payload, 1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('route should success at creating and returning the right value', async () => {
      mockMethodWithResult(resourceService, 'createResourceRate', [payload], Result.ok(1));
      const result = await container.get(ResourceRoutes).createResourceRate(payload, 1);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(201);
    });
  });
  suite('PUT settings/reservation/rate/:resourceRateId', () => {
    const payload: ResourceRateRO = {
      description: 'test',
      rate: 2,
      category: 'test',
      isPublic: true,
      isRequiredAccountNumber: true,
      duration: 2,
    };
    test('route should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'updateResourceRate',
        [payload],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await container.get(ResourceRoutes).updateResourceRate(payload, 1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('route should success at updating and returning the right value', async () => {
      mockMethodWithResult(resourceService, 'updateResourceRate', [payload], Result.ok(1));
      const result = await container.get(ResourceRoutes).updateResourceRate(payload, 1);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(204);
    });
  });
  suite('PUT settings/reservation/time_restriction/:resourceId', () => {
    const payload: ResourceTimerRestrictionRO = {
      isEditingWindowForUsers: true,
      isRestrictCreatingNewReservationBeforeTime: true,
      isRestrictCreatingNewReservationAfterTime: true,
      reservationTimeGranularity: 'test',
      isAllowUsersToEndReservationEarly: true,
      defaultReservationDuration: 'test',
      reservationDurationMinimum: 'test',
      reservationDurationMaximum: 'test',
      bufferTimeBeforeReservation: 'test',
    };
    test('route should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'updateResourceReservationTimerRestriction',
        [payload],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await container.get(ResourceRoutes).updateResourceTimerRestriction(payload, 1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('route should success at updating and returning the right value', async () => {
      mockMethodWithResult(resourceService, 'updateResourceReservationTimerRestriction', [payload], Result.ok(1));
      const result = await container.get(ResourceRoutes).updateResourceTimerRestriction(payload, 1);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(204);
    });
  });
  suite('PUT settings/reservation/visibility/:resourceId', () => {
    const payload: ResourceReservationVisibilityRO = {
      isReservationDetailsVisibilityToNonModerators: true,
    };
    test('route should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'updateResourceReservationVisibility',
        [payload],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await container.get(ResourceRoutes).updateResourceRestrictionVisibility(payload, 1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('route should success at updating and returning the right value', async () => {
      mockMethodWithResult(resourceService, 'updateResourceReservationVisibility', [payload], Result.ok(1));
      const result = await container.get(ResourceRoutes).updateResourceRestrictionVisibility(payload, 1);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(204);
    });
  });
  suite('PUT settings/general/properties/:resourceId', () => {
    const payload: ResourceSettingsGeneralPropertiesRO = {
      accessToResource: 'Test',
    };
    test('route should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'updateResourcesSettingsnGeneralProperties',
        [payload],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await container.get(ResourceRoutes).updateResourcesSettingsnGeneralProperties(payload, 1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('route should success at updating and returning the right value', async () => {
      mockMethodWithResult(resourceService, 'updateResourcesSettingsnGeneralProperties', [payload], Result.ok(1));
      const result = await container.get(ResourceRoutes).updateResourcesSettingsnGeneralProperties(payload, 1);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(204);
    });
  });
  suite('GET settings/:resourceId', () => {
    test('route should fail on throw error', async () => {
      mockMethodWithResult(
        resourceService,
        'getResourceSettings',
        [1],
        Promise.resolve({ isFailure: true, error: 'throwing error' }),
      );
      try {
        await container.get(ResourceRoutes).getResourceSettings(1);
      } catch (error) {
        expect(error).to.equal('throwing error');
      }
    });
    test('route should success at eturning the right value', async () => {
      mockMethodWithResult(resourceService, 'getResourceSettings', [], Result.ok([] as Resource[]));
      const result = await container.get(ResourceRoutes).getResourceSettings(1);
      expect(result.body.statusCode).to.equal(200);
    });
  });
});
