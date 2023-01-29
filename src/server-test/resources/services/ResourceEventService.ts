import { SinonStubbedInstance, createStubInstance, restore, stub } from 'sinon';
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';

import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { ResourceEventDao } from '@/modules/resources/daos/ResourceEventDAO';
import { ResourceEventService } from '@/modules/resources/services/ResourceEventService';
import { container } from '@/di';
import intern from 'intern';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');

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

  test('Should create the right instance', () => {
    const instance = ResourceEventService.getInstance();
    expect(instance instanceof ResourceEventService);
  });
});
