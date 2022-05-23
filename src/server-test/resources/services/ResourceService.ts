import intern from 'intern';
import { stub, restore, SinonStubbedInstance, createStubInstance } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { container } from '@/di';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { ResourceService } from '@/modules/resources/services/ResourceService';
import { OrganizationService } from '@/modules/organizations/services/OrganizationService';
import { ResourceDao } from '@/modules/resources/daos/ResourceDao';
import { MemberService } from '@/modules/hr/services/MemberService';
import { ResourceSettingsService } from '@/modules/resources/services/ResourceSettingsService';
import { ResourceRateService } from '@/modules/resources/services/ResourceRateService';
import { ResourceCalendarService } from '@/modules/resources/services/ResourceCalendarService';
import { ResourceTagService } from '@/modules/resources/services/ResourceTagService';
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
import { mockMethodWithResult } from '@/utils/utilities';
import { Result } from '@/utils/Result';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { BaseService } from '@/modules/base/services/BaseService';
import Sinon = require('sinon');
import { Collection } from '@mikro-orm/core';
import { ResourceStatusHistoryService, ResourceStatusService } from '@/modules/resources';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let resourceDao: SinonStubbedInstance<ResourceDao>;
  let organizationService: SinonStubbedInstance<OrganizationService>;
  let memberService: SinonStubbedInstance<MemberService>;
  let resourceSettingsService: SinonStubbedInstance<ResourceSettingsService>;
  let resourceRateService: SinonStubbedInstance<ResourceRateService>;
  let resourceCalendarService: SinonStubbedInstance<ResourceCalendarService>;
  let resourceTagService: SinonStubbedInstance<ResourceTagService>;
  let resourceStatusHistoryService: SinonStubbedInstance<ResourceStatusHistoryService>;
  let resourceStatusService: SinonStubbedInstance<ResourceStatusService>;

  beforeEach(() => {
    createStubInstance(Configuration);
    resourceDao = createStubInstance(ResourceDao);
    organizationService = createStubInstance(OrganizationService);
    memberService = createStubInstance(MemberService);
    resourceSettingsService = createStubInstance(ResourceSettingsService);
    resourceRateService = createStubInstance(ResourceRateService);
    resourceCalendarService = createStubInstance(ResourceCalendarService);
    resourceTagService = createStubInstance(ResourceTagService);
    resourceStatusHistoryService = createStubInstance(ResourceStatusHistoryService);
    resourceStatusService = createStubInstance(ResourceStatusService);

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
    mockedContainer
      .withArgs(ResourceService)
      .returns(
        new ResourceService(
          resourceDao,
          organizationService,
          memberService,
          resourceSettingsService,
          resourceRateService,
          resourceCalendarService,
          resourceTagService,
          resourceStatusHistoryService,
          resourceStatusService,
        ),
      );
  });

  afterEach(() => {
    restore();
  });

  test('should create the right instance', () => {
    const instance = ResourceService.getInstance();
    expect(instance instanceof ResourceService);
  });

  suite('create resource', () => {
    const user = 1;
    const organization = 1;
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
      managers: [{ user, organization }],
    };
    test('should fail on organization not found', async () => {
      mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok(null)));
      const result = await container.get(ResourceService).createResource(payload);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Organization with id ${payload.organization} does not exist.`);
    });

    test('should fail on manager does not exist', async () => {
      mockMethodWithResult(organizationService, 'get', [], Promise.resolve(Result.ok({})));
      mockMethodWithResult(memberService, 'getByCriteria', [], Promise.resolve(Result.ok(null)));

      const result = await container.get(ResourceService).createResource(payload);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(
        `Manager with user id ${user} in organization with id ${organization} does not exist.`,
      );
    });

    test('should fail on can not create settings for resource', async () => {
      mockMethodWithResult(organizationService, 'get', [], Promise.resolve(Result.ok(1)));
      mockMethodWithResult(memberService, 'getByCriteria', [], Promise.resolve(Result.ok(1)));
      mockMethodWithResult(resourceSettingsService, 'create', [], Promise.resolve(Result.ok()));

      const result = await container.get(ResourceService).createResource(payload);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Can not create settings for resource.`);
    });

    test('should fail on create resource ', async () => {
      mockMethodWithResult(organizationService, 'get', [], Promise.resolve(Result.ok(1)));
      mockMethodWithResult(memberService, 'getByCriteria', [], Promise.resolve(Result.ok(1)));
      mockMethodWithResult(resourceSettingsService, 'create', [], Promise.resolve(Result.ok(1)));
      mockMethodWithResult(resourceDao, 'create', [], null);

      const result = await container.get(ResourceService).createResource(payload);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`fail to create resource.`);
    });

    test('should succeed on create resource', async () => {
      const crPayload = { ...payload };
      crPayload.managers;
      crPayload.tags = [{ title: '' }];
      delete crPayload.user;
      delete crPayload.organization;
      mockMethodWithResult(organizationService, 'get', [], Promise.resolve(Result.ok({})));
      mockMethodWithResult(memberService, 'getByCriteria', [], Promise.resolve(Result.ok({})));
      mockMethodWithResult(resourceSettingsService, 'create', [], Promise.resolve(Result.ok({})));
      mockMethodWithResult(resourceDao, 'create', [Sinon.match.any], {
        managers: {
          init: stub(),
          add: stub(),
        },
      });
      Collection.prototype.init = stub();
      mockMethodWithResult(resourceTagService, 'create', [], Promise.resolve(Result.ok({})));
      mockMethodWithResult(resourceDao, 'update', [], {});
      const result = await container.get(ResourceService).createResource(crPayload);

      expect(result.isSuccess).to.be.true;
    });
    test('should succeed on create resource v2', async () => {
      const crPayload = { ...payload };
      delete crPayload.managers;
      delete crPayload.user;
      delete crPayload.organization;
      mockMethodWithResult(organizationService, 'get', [], Promise.resolve(Result.ok({})));
      mockMethodWithResult(memberService, 'getByCriteria', [], Promise.resolve(Result.ok({})));
      mockMethodWithResult(resourceSettingsService, 'create', [], Promise.resolve(Result.ok({})));
      mockMethodWithResult(resourceDao, 'create', [Sinon.match.any], {
        managers: {
          init: stub(),
          add: stub(),
        },
      });
      Collection.prototype.init = stub();
      mockMethodWithResult(resourceTagService, 'create', [], Promise.resolve(Result.ok({})));
      mockMethodWithResult(resourceDao, 'update', [], {});
      const result = await container.get(ResourceService).createResource(crPayload);

      expect(result.isSuccess).to.be.true;
    });
  });

  suite('get Resources Of A Given Organization By Id', () => {
    const organizationId = 1;
    test('should fail organization Id should be provided', async () => {
      const result = await container.get(ResourceService).getResourcesOfAGivenOrganizationById(null);
      expect(result.error.message).to.equal(`Organization id should be provided.`);
    });
    test('should fail organization does not exist', async () => {
      mockMethodWithResult(organizationService, 'get', [organizationId], Promise.resolve(Result.notFound(null)));

      const result = await container.get(ResourceService).getResourcesOfAGivenOrganizationById(organizationId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Organization with id ${organizationId} does not exist.`);
    });
    test('should fail on can not get resources of organization', async () => {
      mockMethodWithResult(organizationService, 'get', [organizationId], Promise.resolve(Result.ok({})));
      mockMethodWithResult(resourceDao, 'getByCriteria', [organizationId, FETCH_STRATEGY.ALL, { refresh: true }], null);

      const result = await container.get(ResourceService).getResourcesOfAGivenOrganizationById(organizationId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`can not get resources of organization with id ${organizationId}.`);
    });
    test('should return organization resource ', async () => {
      mockMethodWithResult(organizationService, 'get', [organizationId], Promise.resolve(Result.ok({})));
      mockMethodWithResult(resourceDao, 'getByCriteria', [], Promise.resolve([1]));

      const result = await container.get(ResourceService).getResourcesOfAGivenOrganizationById(organizationId);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.eql([1]);
    });
  });
  suite('update resource', () => {
    const resourceId = 1;
    const payload: ResourceRO = {
      name: 'resource_dash_one',
      organization: 1,
    } as any;
    test('should fail on resource not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [resourceId], Promise.resolve(null));
      const result = await container.get(ResourceService).updateResource(payload, resourceId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Resource with id ${resourceId} does not exist.`);
    });
    test('should fail on organization not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [resourceId], Promise.resolve(Result.ok({})));
      mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(null));

      const result = await container.get(ResourceService).updateResource(payload, resourceId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Organization with id ${payload.organization} does not exist.`);
    });
    test('should fail on resource can not be updated', async () => {
      mockMethodWithResult(resourceDao, 'get', [resourceId], Promise.resolve(Result.ok({})));
      mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok({})));

      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], Promise.resolve(null));

      const result = await container.get(ResourceService).updateResource(payload, resourceId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`resource with id ${resourceId} can not be updated.`);
    });
    test('should update resource without organization', async () => {
      const mockPayload = { ...payload };
      delete mockPayload.organization;

      mockMethodWithResult(resourceDao, 'get', [resourceId], Promise.resolve(Result.ok({})));

      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], Promise.resolve(Result.ok({})));

      const result = await container.get(ResourceService).updateResource(mockPayload, resourceId);

      expect(result.isSuccess).to.be.true;
    });
    test('should update resource', async () => {
      mockMethodWithResult(resourceDao, 'get', [resourceId], Promise.resolve(Result.ok({})));
      mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok({})));

      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], Promise.resolve(Result.ok({})));

      const result = await container.get(ResourceService).updateResource(payload, resourceId);

      expect(result.isSuccess).to.be.true;
    });
  });
  suite('create resource calendar', () => {
    const payload = {
      name: 'test',
      active: true,
      organization: 1,
      hoursPerDay: 2,
      timezone: 'gmt+1',
      twoWeeksCalendar: true,
    };
    test('should fail on organization does not exist', async () => {
      mockMethodWithResult(organizationService, 'get', [], Promise.resolve(null));
      const result = await container.get(ResourceService).createResourceCalendar(payload);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Organization with id ${payload.organization} does not exist.`);
    });
    test('should fail to create resource calendar', async () => {
      mockMethodWithResult(organizationService, 'get', [], Promise.resolve(Result.ok({ id: 1 })));
      mockMethodWithResult(resourceCalendarService, 'wrapEntity', [], Promise.resolve({}));

      mockMethodWithResult(resourceCalendarService, 'create', [], Promise.resolve(Result.ok(null)));

      const result = await container.get(ResourceService).createResourceCalendar(payload);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`fail to create resource calendar.`);
    });
    test('should succeed create resource calendar without organization', async () => {
      const mockPayload = { ...payload };
      delete mockPayload.organization;

      mockMethodWithResult(resourceCalendarService, 'wrapEntity', [], Promise.resolve({}));

      mockMethodWithResult(resourceCalendarService, 'create', [], Promise.resolve(Result.ok({})));

      const result = await container.get(ResourceService).createResourceCalendar(mockPayload);

      expect(result.isSuccess).to.be.true;
    });
    test('should succeed create resource calendar', async () => {
      mockMethodWithResult(organizationService, 'get', [], Promise.resolve(Result.ok({ id: 1 })));
      mockMethodWithResult(resourceCalendarService, 'wrapEntity', [], Promise.resolve({}));

      mockMethodWithResult(resourceCalendarService, 'create', [], Promise.resolve(Result.ok({})));

      const result = await container.get(ResourceService).createResourceCalendar(payload);

      expect(result.isSuccess).to.be.true;
    });
  });
  suite('Get Resource Settings', () => {
    const resourceId = 1;
    test('should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], Promise.resolve(null));
      const result = await container.get(ResourceService).getResourceSettings(resourceId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Resource with id ${resourceId} does not exist.`);
    });
    test('should succed getting resource settings', async () => {
      mockMethodWithResult(resourceDao, 'get', [], Promise.resolve({}));
      const result = await container.get(ResourceService).getResourceSettings(resourceId);
      expect(result.isSuccess).to.be.true;
    });
  });
  suite('update Resource Reservation General', () => {
    const resourceId = 1;
    const payload: ResourcesSettingsReservationGeneralRO = {
      isEnabled: true,
    };
    test('should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      const result = await container.get(ResourceService).updateResourceReservationGeneral(payload, resourceId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Resource with id ${resourceId} does not exist.`);
    });
    test('should fail on resource reservation general can not be updated', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});

      mockMethodWithResult(resourceDao, 'update', [], null);

      const result = await container.get(ResourceService).updateResourceReservationGeneral(payload, resourceId);

      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(
        `Reservation General setings of resource with id ${resourceId} can not be updated.`,
      );
    });
    test('should succeed update resource reservation general ', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});

      mockMethodWithResult(resourceDao, 'update', [], { id: 1 });

      const result = await container.get(ResourceService).updateResourceReservationGeneral(payload, resourceId);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.equal(1);
    });
  });
  suite('update Resource Reservation Status', () => {
    const resourceId = 1;
    const payload: ResourceSettingsGeneralStatusRO = {
      resourceStatus: 'OPERATIONAL',
      statusDescription: 'test',
      memberId: 1,
    };
    test('should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      const result = await container.get(ResourceService).updateResourcesSettingsGeneralStatus(payload, resourceId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Resource with id ${resourceId} does not exist.`);
    });
    test('should fail on status general settings can not be updated', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], null);

      const result = await container.get(ResourceService).updateResourcesSettingsGeneralStatus(payload, resourceId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(
        `Status General setings of resource with id ${resourceId} can not be updated.`,
      );
    });
    test('should succeed upcating status general settings', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], {});

      const result = await container.get(ResourceService).updateResourcesSettingsGeneralStatus(payload, resourceId);
      expect(result.isSuccess).to.be.true;
    });
  });
  suite('update Resource Reservation Units', () => {
    const resourceId = 1;
    const payload: ResourcesSettingsReservationUnitRO = {
      unitLimit: 2,
      unitName: 'aze',
      unites: 0,
    };
    test('should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      const result = await container.get(ResourceService).updateResourceReservationUnits(payload, resourceId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Resource with id ${resourceId} does not exist.`);
    });
    test('should fail on Units General setings can not be updated', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], null);

      const result = await container.get(ResourceService).updateResourceReservationUnits(payload, resourceId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(
        `Units General setings of resource with id ${resourceId} can not be updated.`,
      );
    });
    test('should succeed updating Units general settings', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], {});

      const result = await container.get(ResourceService).updateResourceReservationUnits(payload, resourceId);
      expect(result.isSuccess).to.be.true;
    });
  });
  suite('update Resources Settings Reservation Visibility', () => {
    const resourceId = 1;
    const payload: ResourceReservationVisibilityRO = {
      isReservationDetailsVisibilityToNonModerators: true,
    };
    test('should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      const result = await container.get(ResourceService).updateResourceReservationVisibility(payload, resourceId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Resource with id ${resourceId} does not exist.`);
    });
    test('should fail on Visibility Reservation setings can not be updated', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], null);

      const result = await container.get(ResourceService).updateResourceReservationVisibility(payload, resourceId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(
        `Visibility Reservation setings of resource with id ${resourceId} can not be updated.`,
      );
    });
    test('should succeed updating Visibility Reservation settings', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], {});

      const result = await container.get(ResourceService).updateResourceReservationVisibility(payload, resourceId);
      expect(result.isSuccess).to.be.true;
    });
  });
  suite('update Resources Settings General Visibility', () => {
    const resourceId = 1;
    const payload: ResourceSettingsGeneralVisibilityRO = {
      visibility: true,
      isUnlistedOnOrganizationPage: true,
      isUnlistedToUsersWhoCannotReserve: true,
      isFullyHiddentoUsersWhoCannotReserve: true,
      isPromotedOnSitePageAsALargeButtonAboveOtherResources: true,
      isHideAvailabilityonSitePage: true,
    };
    test('should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      const result = await container.get(ResourceService).updateResourcesSettingsGeneralVisibility(payload, resourceId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Resource with id ${resourceId} does not exist.`);
    });
    test('should fail on Visibility General setings can not be updated', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], null);

      const result = await container.get(ResourceService).updateResourcesSettingsGeneralVisibility(payload, resourceId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(
        `Visibility General setings of resource with id ${resourceId} can not be updated.`,
      );
    });
    test('should succeed updating Visibility general settings', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], {});

      const result = await container.get(ResourceService).updateResourcesSettingsGeneralVisibility(payload, resourceId);
      expect(result.isSuccess).to.be.true;
    });
  });
  suite('update Resources Settings General properties', () => {
    const resourceId = 1;
    const payload: ResourceSettingsGeneralPropertiesRO = {
      accessToResource: 'Test',
    };
    test('should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      const result = await container
        .get(ResourceService)
        .updateResourcesSettingsnGeneralProperties(payload, resourceId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Resource with id ${resourceId} does not exist.`);
    });
    test('should fail on properties General properties setings can not be updated', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], null);

      const result = await container
        .get(ResourceService)
        .updateResourcesSettingsnGeneralProperties(payload, resourceId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(
        `General roperties settings of resource with id ${resourceId} can not be updated.`,
      );
    });
    test('should succeed updating general properties settings', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], {});

      const result = await container
        .get(ResourceService)
        .updateResourcesSettingsnGeneralProperties(payload, resourceId);
      expect(result.isSuccess).to.be.true;
    });
  });
  suite('Get Resources rate Settings', () => {
    const resourceId = 1;
    test('should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      const result = await container.get(ResourceService).getResourceRate(resourceId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Resource with id ${resourceId} does not exist.`);
    });
    test('should fail on Resource Rate can not get', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      mockMethodWithResult(resourceRateService, 'getByCriteria', [], Promise.resolve(Result.ok(null)));

      const result = await container.get(ResourceService).getResourceRate(resourceId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Can not get resource rate.`);
    });
    test('should succeed getting resource rate', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      mockMethodWithResult(resourceRateService, 'getByCriteria', [], Promise.resolve(Result.ok({})));

      const result = await container.get(ResourceService).getResourceRate(resourceId);
      expect(result.isSuccess).to.be.true;
    });
  });
  suite('create Resources rate Settings', () => {
    const resourceId = 1;
    const payload: ResourceRateRO = {
      description: 'test',
      rate: 2,
      category: 'test',
      isPublic: true,
      isRequiredAccountNumber: true,
      duration: 2,
    };
    test('should fail on resource rate does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      const result = await container.get(ResourceService).createResourceRate(payload, resourceId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Resource with id ${resourceId} does not exist.`);
    });
    test('should fail on Resource Rate can not be created', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      mockMethodWithResult(resourceRateService, 'create', [], Promise.resolve(Result.ok(null)));

      const result = await container.get(ResourceService).createResourceRate(payload, resourceId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Resource Rate can not be created.`);
    });
    test('should succeed creating resource rate', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      mockMethodWithResult(resourceRateService, 'create', [], Promise.resolve(Result.ok({})));

      const result = await container.get(ResourceService).createResourceRate(payload, resourceId);
      expect(result.isSuccess).to.be.true;
    });
  });
  suite('update Resources rate Settings', () => {
    const resourceRateId = 1;
    const payload: ResourceRateRO = {
      description: 'test',
      rate: 2,
      category: 'test',
      isPublic: true,
      isRequiredAccountNumber: true,
      duration: 2,
    };
    test('should fail on resource rate does not exist', async () => {
      mockMethodWithResult(resourceRateService, 'get', [], Promise.resolve(Result.ok(null)));

      const result = await container.get(ResourceService).updateResourceRate(payload, resourceRateId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Resource Rate with id ${resourceRateId} does not exist.`);
    });
    test('should fail on resource rate can not be updated', async () => {
      mockMethodWithResult(resourceRateService, 'get', [], Promise.resolve(Result.ok({})));
      mockMethodWithResult(resourceRateService, 'wrapEntity', [], Promise.resolve({}));
      mockMethodWithResult(resourceRateService, 'update', [], Promise.resolve(Result.ok(null)));

      const result = await container.get(ResourceService).updateResourceRate(payload, resourceRateId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Resource rate with id ${resourceRateId} can not be updated.`);
    });
    test('should succeed updating resource rate', async () => {
      mockMethodWithResult(resourceRateService, 'get', [], Promise.resolve(Result.ok({})));
      mockMethodWithResult(resourceRateService, 'wrapEntity', [], Promise.resolve({}));
      mockMethodWithResult(resourceRateService, 'update', [], Promise.resolve(Result.ok({})));

      const result = await container.get(ResourceService).updateResourceRate(payload, resourceRateId);
      expect(result.isSuccess).to.be.true;
    });
  });
  suite('update Resource Reservation Timer Restriction Settings', () => {
    const resourceId = 1;
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
    test('should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      const result = await container
        .get(ResourceService)
        .updateResourceReservationTimerRestriction(payload, resourceId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(`Resource with id ${resourceId} does not exist.`);
    });
    test('should fail on properties Reservation Timer Restriction Settings can not be updated', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], null);

      const result = await container
        .get(ResourceService)
        .updateResourceReservationTimerRestriction(payload, resourceId);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal(
        `Reservation time restriction of resource with id ${resourceId} can not be updated.`,
      );
    });
    test('should succeed updating resource reservation Timer Restriction Settings', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], {});

      const result = await container
        .get(ResourceService)
        .updateResourceReservationTimerRestriction(payload, resourceId);
      expect(result.isSuccess).to.be.true;
    });
  });
});
