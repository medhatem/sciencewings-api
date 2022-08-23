import {
  ResourceRO,
  ResourceRateRO,
  ResourceReservationVisibilityRO,
  ResourceSettingsGeneralPropertiesRO,
  ResourceSettingsGeneralVisibilityRO,
  ResourceTimerRestrictionRO,
  ResourcesSettingsReservationGeneralRO,
  ResourcesSettingsReservationUnitRO,
} from '@/modules/resources/routes/RequestObject';
import { SinonStubbedInstance, createStubInstance, restore, stub } from 'sinon';
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';

import { BaseService } from '@/modules/base/services/BaseService';
import { Collection } from '@mikro-orm/core';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { MemberService } from '@/modules/hr/services/MemberService';
import { OrganizationService } from '@/modules/organizations/services/OrganizationService';
import { UserService } from '@/modules/users/services/UserService';
import { ResourceCalendarService } from '@/modules/resources/services/ResourceCalendarService';
import { ResourceDao } from '@/modules/resources/daos/ResourceDao';
import { ResourceRateService } from '@/modules/resources/services/ResourceRateService';
import { ResourceService } from '@/modules/resources/services/ResourceService';
import { ResourceSettingsService } from '@/modules/resources/services/ResourceSettingsService';
import { ResourceStatusHistoryService } from '@/modules/resources/services/ResourceStatusHistoryService';
import { ResourceStatusService } from '@/modules/resources/services/ResourceStatusService';
import { ResourceTagService } from '@/modules/resources/services/ResourceTagService';
import { container } from '@/di';
import intern from 'intern';
import { mockMethodWithResult } from '@/utils/utilities';

const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import Sinon = require('sinon');

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let resourceDao: SinonStubbedInstance<ResourceDao>;
  let organizationService: SinonStubbedInstance<OrganizationService>;
  let userService: SinonStubbedInstance<UserService>;
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
    userService = createStubInstance(UserService);
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
          userService,
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

  test('Should create the right instance', () => {
    const instance = ResourceService.getInstance();
    expect(instance instanceof ResourceService);
  });

  suite('create resource', () => {
    const payload: ResourceRO = {
      name: 'resource_dash_one',
      description: 'string',
      resourceType: 'USER',
      resourceClass: 'TECH',
      organization: 1,
      user: 1,
    };
    test('Should fail on organization not found', async () => {
      mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(null));
      try {
        await container.get(ResourceService).createResource(payload);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal(`ORG.NON_EXISTANT_DATA {{org}}`);
      }
    });

    test('Should fail on manager does not exist', async () => {
      mockMethodWithResult(organizationService, 'get', [], Promise.resolve({}));
      mockMethodWithResult(memberService, 'getByCriteria', [], Promise.resolve(null));

      try {
        await container.get(ResourceService).createResource(payload);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal(`MEMBER.NON_EXISTANT`);
      }
    });

    test('Should fail on create resource', async () => {
      mockMethodWithResult(organizationService, 'get', [], Promise.resolve(1));
      mockMethodWithResult(memberService, 'getByCriteria', [], Promise.resolve(1));
      mockMethodWithResult(resourceStatusService, 'get', [], Promise.resolve({}));
      mockMethodWithResult(resourceSettingsService, 'create', [], Promise.resolve(1));
      mockMethodWithResult(resourceDao, 'create', [], Promise.reject(new Error('Failed')));
      try {
        await container.get(ResourceService).createResource(payload);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal(`Failed`);
      }
    });

    test('Should succeed on create resource', async () => {
      const crPayload = { ...payload };
      delete crPayload.user;
      delete crPayload.organization;
      mockMethodWithResult(organizationService, 'get', [], Promise.resolve({}));
      mockMethodWithResult(memberService, 'getByCriteria', [], Promise.resolve({}));
      mockMethodWithResult(resourceStatusService, 'get', [], Promise.resolve({}));
      mockMethodWithResult(resourceSettingsService, 'create', [], Promise.resolve({}));
      mockMethodWithResult(resourceDao, 'create', [Sinon.match.any], {
        id: '133',
        managers: {
          init: stub(),
          add: stub(),
        },
      });
      Collection.prototype.init = stub();
      mockMethodWithResult(resourceTagService, 'create', [], Promise.resolve({}));
      mockMethodWithResult(resourceDao, 'update', [], {});
      const result = await container.get(ResourceService).createResource(crPayload);

      expect(result).to.equal('133');
    });
    test('Should succeed on create resource v2', async () => {
      const crPayload = { ...payload };
      delete crPayload.user;
      delete crPayload.organization;
      mockMethodWithResult(organizationService, 'get', [], Promise.resolve({}));
      mockMethodWithResult(memberService, 'getByCriteria', [], Promise.resolve({}));
      mockMethodWithResult(resourceStatusService, 'get', [], Promise.resolve({}));
      mockMethodWithResult(resourceSettingsService, 'create', [], Promise.resolve({}));
      mockMethodWithResult(resourceDao, 'create', [Sinon.match.any], {
        id: '133',
        managers: {
          init: stub(),
          add: stub(),
        },
      });
      Collection.prototype.init = stub();
      mockMethodWithResult(resourceTagService, 'create', [], Promise.resolve({}));
      mockMethodWithResult(resourceDao, 'update', [Sinon.match.any], { id: '133' });
      const result = await container.get(ResourceService).createResource(crPayload);

      expect(result).to.equal('133');
    });
  });

  suite('get Resources Of A Given Organization By Id', () => {
    const organizationId = 1;
    test('Should fail organization Id should be provided', async () => {
      try {
        await container.get(ResourceService).getResourcesOfAGivenOrganizationById(null);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal(`required {{field}}`);
      }
    });
    test('Should fail organization does not exist', async () => {
      mockMethodWithResult(organizationService, 'get', [organizationId], Promise.reject(new Error('Failed')));

      try {
        await container.get(ResourceService).getResourcesOfAGivenOrganizationById(organizationId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should return organization resource ', async () => {
      mockMethodWithResult(organizationService, 'get', [organizationId], Promise.resolve({}));
      mockMethodWithResult(resourceDao, 'getByCriteria', [], Promise.resolve([1]));

      const result = await container.get(ResourceService).getResourcesOfAGivenOrganizationById(organizationId);

      await container.get(ResourceService).getResourcesOfAGivenOrganizationById(organizationId);
      expect(result).to.eql([1]);
    });
  });
  suite('update resource', () => {
    const resourceId = 1;
    const payload: ResourceRO = {
      name: 'resource_dash_one',
      organization: 1,
    } as any;
    test('Should fail on resource not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [resourceId], Promise.resolve(null));
      try {
        await container.get(ResourceService).updateResource(payload, resourceId);
      } catch (error) {
        expect(error.message).to.equal('RESOURCE.NON_EXISTANT {{resource}}');
      }
    });
    test('Should fail on organization not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [resourceId], Promise.resolve({}));
      mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(null));

      try {
        await container.get(ResourceService).updateResource(payload, resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal(`ORG.NON_EXISTANT_DATA {{org}}`);
      }
    });
    test('Should fail on resource can not be updated', async () => {
      mockMethodWithResult(resourceDao, 'get', [resourceId], Promise.resolve({}));
      mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve({}));

      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], Promise.reject(new Error('Failed')));

      try {
        await container.get(ResourceService).updateResource(payload, resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal(`Failed`);
      }
    });
    test('Should update resource without organization', async () => {
      const mockPayload = { ...payload };
      delete mockPayload.organization;

      mockMethodWithResult(resourceDao, 'get', [resourceId], Promise.resolve({}));

      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [{}], Promise.resolve({ id: '133' }));

      const result = await container.get(ResourceService).updateResource(mockPayload, resourceId);

      expect(result).to.equal('133');
    });
    test('Should update resource', async () => {
      mockMethodWithResult(resourceDao, 'get', [resourceId], Promise.resolve({}));
      mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve({}));

      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [{}], Promise.resolve({ id: '133' }));

      const result = await container.get(ResourceService).updateResource(payload, resourceId);
      expect(result).to.equal('133');
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
    test('Should fail on organization does not exist', async () => {
      mockMethodWithResult(organizationService, 'get', [], Promise.resolve(null));

      try {
        await container.get(ResourceService).createResourceCalendar(payload);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('ORG.NON_EXISTANT_DATA {{org}}');
      }
    });
    test('Should fail to create resource calendar', async () => {
      mockMethodWithResult(organizationService, 'get', [], Promise.resolve({ id: 1 }));
      mockMethodWithResult(resourceCalendarService, 'wrapEntity', [], Promise.resolve({}));

      mockMethodWithResult(resourceCalendarService, 'create', [], Promise.reject(new Error('Failed')));

      try {
        await container.get(ResourceService).createResourceCalendar(payload);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should succeed create resource calendar without organization', async () => {
      const mockPayload = { ...payload };
      delete mockPayload.organization;

      mockMethodWithResult(resourceCalendarService, 'wrapEntity', [], {});

      mockMethodWithResult(resourceCalendarService, 'create', [{}], Promise.resolve({ id: '133' }));

      const result = await container.get(ResourceService).createResourceCalendar(mockPayload);

      expect(result).to.eql({ id: '133' });
    });
    test('Should succeed create resource calendar', async () => {
      mockMethodWithResult(organizationService, 'get', [], Promise.resolve({ id: 1 }));
      mockMethodWithResult(resourceCalendarService, 'wrapEntity', [], {});

      mockMethodWithResult(resourceCalendarService, 'create', [{}], Promise.resolve({ id: '133' }));

      const result = await container.get(ResourceService).createResourceCalendar(payload);
      expect(result).to.eql({ id: '133' });
    });
  });
  suite('Get Resource Settings', () => {
    const resourceId = 1;
    test('Should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], Promise.resolve(null));
      try {
        await container.get(ResourceService).getResourceSettings(resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('RESOURCE.NON_EXISTANT {{resource}}');
      }
    });
    test('Should succeed getting resource settings', async () => {
      mockMethodWithResult(resourceDao, 'get', [], Promise.resolve({ settings: {} }));
      const result = await container.get(ResourceService).getResourceSettings(resourceId);
      expect(result).to.eql({});
    });
  });
  suite('update Resource Reservation General', () => {
    const resourceId = 1;
    const payload: ResourcesSettingsReservationGeneralRO = {
      isEnabled: true,
    };
    test('Should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      try {
        await container.get(ResourceService).updateResourceReservationGeneral(payload, resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('RESOURCE.NON_EXISTANT {{resource}}');
      }
    });
    test('Should fail on resource reservation general can not be updated', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});

      mockMethodWithResult(resourceDao, 'update', [], Promise.reject(new Error('Failed')));

      try {
        await container.get(ResourceService).updateResourceReservationGeneral(payload, resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should succeed update resource reservation general ', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});

      mockMethodWithResult(resourceDao, 'update', [], { id: 1 });

      const result = await container.get(ResourceService).updateResourceReservationGeneral(payload, resourceId);

      expect(result).to.equal(1);
    });
  });
  suite('update Resource Reservation Status', () => {
    const resourceId = 1;
    const payload = {
      statusType: 'ORGANIZATION',
      statusDescription: 'test',
      memberId: 1,
    } as any;
    test('Should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      try {
        await container.get(ResourceService).updateResourcesSettingsGeneralStatus(payload, resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('RESOURCE.NON_EXISTANT {{resource}}');
      }
    });
    test('Should fail on status general settings can not be updated', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(memberService, 'get', [], Promise.resolve({}));
      mockMethodWithResult(resourceStatusHistoryService, 'create', [], Promise.reject(new Error('Failed')));

      try {
        await container.get(ResourceService).updateResourcesSettingsGeneralStatus(payload, resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should succeed updating status general settings', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], {});
      mockMethodWithResult(memberService, 'get', [], Promise.resolve({}));
      mockMethodWithResult(resourceStatusHistoryService, 'create', [], Promise.resolve({ id: 1 }));
      const result = await container.get(ResourceService).updateResourcesSettingsGeneralStatus(payload, resourceId);
      expect(result).to.equal(1);
    });
  });
  suite('update Resource Reservation Units', () => {
    const resourceId = 1;
    const payload: ResourcesSettingsReservationUnitRO = {
      unitLimit: 2,
      unitName: 'aze',
      unites: 0,
    };
    test('Should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      try {
        await container.get(ResourceService).updateResourceReservationUnits(payload, resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('RESOURCE.NON_EXISTANT {{resource}}');
      }
    });
    test('Should fail on Units General setings can not be updated', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], Promise.reject(new Error('Failed')));

      try {
        await container.get(ResourceService).updateResourceReservationUnits(payload, resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should succeed updating Units general settings', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], { id: '133' });

      const result = await container.get(ResourceService).updateResourceReservationUnits(payload, resourceId);
      expect(result).to.equal('133');
    });
  });
  suite('update Resources Settings Reservation Visibility', () => {
    const resourceId = 1;
    const payload: ResourceReservationVisibilityRO = {
      isReservationDetailsVisibilityToNonModerators: true,
    };
    test('Should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      try {
        await container.get(ResourceService).updateResourceReservationVisibility(payload, resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('RESOURCE.NON_EXISTANT {{resource}}');
      }
    });
    test('Should fail on Visibility Reservation setings can not be updated', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], Promise.reject(new Error('Failed')));

      try {
        await container.get(ResourceService).updateResourceReservationVisibility(payload, resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should succeed updating Visibility Reservation settings', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], { id: '133' });

      const result = await container.get(ResourceService).updateResourceReservationVisibility(payload, resourceId);
      expect(result).to.equal('133');
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
    test('Should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      try {
        await container.get(ResourceService).updateResourcesSettingsGeneralVisibility(payload, resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('RESOURCE.NON_EXISTANT {{resource}}');
      }
    });
    test('Should fail on Visibility General setings can not be updated', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], Promise.reject(new Error('Failed')));

      try {
        await container.get(ResourceService).updateResourcesSettingsGeneralVisibility(payload, resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should succeed updating Visibility general settings', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], { id: '133' });

      const result = await container.get(ResourceService).updateResourcesSettingsGeneralVisibility(payload, resourceId);
      expect(result).to.equal('133');
    });
  });
  suite('update Resources Settings General properties', () => {
    const resourceId = 1;
    const payload: ResourceSettingsGeneralPropertiesRO = {
      accessToResource: 'Test',
    };
    test('Should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      try {
        await container.get(ResourceService).updateResourcesSettingsnGeneralProperties(payload, resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('RESOURCE.NON_EXISTANT {{resource}}');
      }
    });
    test('Should fail on properties General properties setings can not be updated', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [{}], Promise.reject(new Error('Failed')));

      try {
        await container.get(ResourceService).updateResourcesSettingsnGeneralProperties(payload, resourceId);

        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should succeed updating general properties settings', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], { id: '133' });

      const result = await container
        .get(ResourceService)
        .updateResourcesSettingsnGeneralProperties(payload, resourceId);
      expect(result).to.equal('133');
    });
  });
  suite('Get Resources rate Settings', () => {
    const resourceId = 1;
    test('Should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      try {
        await container.get(ResourceService).getResourceRate(resourceId);

        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('RESOURCE.NON_EXISTANT {{resource}}');
      }
    });
    test('Should fail on Resource Rate can not get', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      mockMethodWithResult(resourceRateService, 'getByCriteria', [], Promise.reject(new Error('Failed')));

      try {
        await container.get(ResourceService).getResourceRate(resourceId);

        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should succeed getting resource rate', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      mockMethodWithResult(resourceRateService, 'getByCriteria', [], Promise.resolve([{ id: '123' }]));

      const result = await container.get(ResourceService).getResourceRate(resourceId);
      expect(result).to.eql([{ id: '123' }]);
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
    test('Should fail on resource rate does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      try {
        await container.get(ResourceService).createResourceRate(payload, resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('RESOURCE.NON_EXISTANT {{resource}}');
      }
    });
    test('Should fail on Resource Rate can not be created', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      mockMethodWithResult(resourceRateService, 'create', [], Promise.reject(new Error('Failed')));

      try {
        await container.get(ResourceService).createResourceRate(payload, resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should succeed creating resource rate', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      mockMethodWithResult(resourceRateService, 'create', [], Promise.resolve({ id: '123' }));

      const result = await container.get(ResourceService).createResourceRate(payload, resourceId);
      expect(result).to.equal('123');
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
    test('Should fail on resource rate does not exist', async () => {
      mockMethodWithResult(resourceRateService, 'get', [], Promise.resolve(null));

      try {
        await container.get(ResourceService).updateResourceRate(payload, resourceRateId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('RESOURCE_RATE.NON_EXISTANT {{rate}}');
      }
    });
    test('Should fail on resource rate can not be updated', async () => {
      mockMethodWithResult(resourceRateService, 'get', [], Promise.resolve({}));
      mockMethodWithResult(resourceRateService, 'wrapEntity', [], Promise.resolve({}));
      mockMethodWithResult(resourceRateService, 'update', [], Promise.reject(new Error('Failed')));

      try {
        await container.get(ResourceService).updateResourceRate(payload, resourceRateId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should succeed updating resource rate', async () => {
      mockMethodWithResult(resourceRateService, 'get', [], Promise.resolve({}));
      mockMethodWithResult(resourceRateService, 'wrapEntity', [], {});
      mockMethodWithResult(resourceRateService, 'update', [{}], Promise.resolve({ id: '133' }));

      const result = await container.get(ResourceService).updateResourceRate(payload, resourceRateId);
      expect(result).to.equal('133');
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
    test('Should fail on resource does not exist', async () => {
      mockMethodWithResult(resourceDao, 'get', [], null);

      try {
        await container.get(ResourceService).updateResourceReservationTimerRestriction(payload, resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('RESOURCE.NON_EXISTANT {{resource}}');
      }
    });
    test('Should fail on properties Reservation Timer Restriction Settings can not be updated', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], Promise.reject(new Error('Failed')));

      try {
        await container.get(ResourceService).updateResourceReservationTimerRestriction(payload, resourceId);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should succeed updating resource reservation Timer Restriction Settings', async () => {
      mockMethodWithResult(resourceDao, 'get', [], {});
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(resourceDao, 'update', [], { id: '133' });

      const result = await container
        .get(ResourceService)
        .updateResourceReservationTimerRestriction(payload, resourceId);
      expect(result).to.equal('133');
    });
  });
});
