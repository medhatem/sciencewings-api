import intern from 'intern';
import { stub, restore, SinonStubbedInstance, createStubInstance } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { container } from '@/di';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { ResourceSettingsService } from '@/modules/resources/services/ResourceSettingsService';
import { ResourceSettingsDao } from '@/modules/resources/daos/ResourceSettingsDAO';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let resourceSettingsDao: SinonStubbedInstance<ResourceSettingsDao>;

  beforeEach(() => {
    createStubInstance(Configuration);
    resourceSettingsDao = createStubInstance(ResourceSettingsDao);
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
    mockedContainer.withArgs(ResourceSettingsService).returns(new ResourceSettingsService(resourceSettingsDao));
  });

  afterEach(() => {
    restore();
  });

  test('should create the right instance', () => {
    const instance = ResourceSettingsService.getInstance();
    expect(instance instanceof ResourceSettingsService);
  });
});
