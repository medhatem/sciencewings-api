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

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let resourceDao: SinonStubbedInstance<ResourceDao>;
  let organizationService: SinonStubbedInstance<OrganizationService>;
  let memberService: SinonStubbedInstance<MemberService>;
  let resourceSettingsService: SinonStubbedInstance<ResourceSettingsService>;
  let resourceRateService: SinonStubbedInstance<ResourceRateService>;
  let resourceCalendarService: SinonStubbedInstance<ResourceCalendarService>;
  let resourceTagService: SinonStubbedInstance<ResourceTagService>;

  beforeEach(() => {
    createStubInstance(Configuration);
    resourceDao = createStubInstance(ResourceDao);
    organizationService = createStubInstance(OrganizationService);
    memberService = createStubInstance(MemberService);
    resourceSettingsService = createStubInstance(ResourceSettingsService);
    resourceRateService = createStubInstance(ResourceRateService);
    resourceCalendarService = createStubInstance(ResourceCalendarService);
    resourceTagService = createStubInstance(ResourceTagService);

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
});
