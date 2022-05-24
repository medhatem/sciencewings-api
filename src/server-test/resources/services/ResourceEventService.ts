import intern from 'intern';
import { stub, restore, SinonStubbedInstance, createStubInstance } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { container } from '@/di';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { ResourceEventService } from '@/modules/resources/services/ResourceEventService';
import { ResourceEventDao } from '@/modules/resources';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let resourceEventDao: SinonStubbedInstance<ResourceEventDao>;
  beforeEach(() => {
    createStubInstance(Configuration);
    resourceEventDao = createStubInstance(ResourceEventDao);
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
    mockedContainer.withArgs(ResourceEventService).returns(new ResourceEventService(resourceEventDao));
  });

  afterEach(() => {
    restore();
  });

  test('should create the right instance', () => {
    const instance = ResourceEventService.getInstance();
    expect(instance instanceof ResourceEventService);
  });
});
