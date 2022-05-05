import intern from 'intern';
import { stub, restore, SinonStubbedInstance, createStubInstance } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { container } from '@/di';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { ResourceCalendarService } from '@/modules/resources/services/ResourceCalendarService';
import { ResourceCalendarDao } from '@/modules/resources/daos/ResourceCalendarDAO';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let resourceCalendarDao: SinonStubbedInstance<ResourceCalendarDao>;

  beforeEach(() => {
    createStubInstance(Configuration);
    resourceCalendarDao = createStubInstance(ResourceCalendarDao);
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
    mockedContainer.withArgs(ResourceCalendarService).returns(new ResourceCalendarService(resourceCalendarDao));
  });

  afterEach(() => {
    restore();
  });

  test('should create the right instance', () => {
    const instance = ResourceCalendarService.getInstance();
    expect(instance instanceof ResourceCalendarService);
  });
});
