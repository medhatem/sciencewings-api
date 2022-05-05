import intern from 'intern';
import { stub, restore, SinonStubbedInstance, createStubInstance } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { container } from '@/di';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { ResourceTagService } from '@/modules/resources/services/ResourceTagService';
import { ResourceTagDao } from '@/modules/resources/daos/ResourceTagDAO';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let resourceTagDao: SinonStubbedInstance<ResourceTagDao>;

  beforeEach(() => {
    createStubInstance(Configuration);
    resourceTagDao = createStubInstance(ResourceTagDao);
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
    mockedContainer.withArgs(ResourceTagService).returns(new ResourceTagService(resourceTagDao));
  });

  afterEach(() => {
    restore();
  });

  test('should create the right instance', () => {
    const instance = ResourceTagService.getInstance();
    expect(instance instanceof ResourceTagService);
  });
});
