import intern from 'intern';
import { stub, restore, SinonStubbedInstance, createStubInstance } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { container } from '@/di';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { ResourceRateService } from '@/modules/resources/services/ResourceRateService';
import { ResourceRateDAO } from '@/modules/resources/daos/ResourceRateDAO';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let resourceRateDAO: SinonStubbedInstance<ResourceRateDAO>;

  beforeEach(() => {
    createStubInstance(Configuration);
    resourceRateDAO = createStubInstance(ResourceRateDAO);

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
    mockedContainer.withArgs(ResourceRateService).returns(new ResourceRateService(resourceRateDAO));
  });

  afterEach(() => {
    restore();
  });

  test('should create the right instance', () => {
    const instance = ResourceRateService.getInstance();
    expect(instance instanceof ResourceRateService);
  });
});
