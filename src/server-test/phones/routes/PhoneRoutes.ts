import intern from 'intern';
import { stub, restore, SinonStubbedInstance, createStubInstance } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { container } from '@/di';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { PhoneRoutes } from '@/modules/phones/routes/PhoneRoutes';
import { LocalStorage } from '@/utils/LocalStorage';
import { PhoneService } from '@/modules/phones/services/PhoneService';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let phoneService: SinonStubbedInstance<PhoneService>;
  beforeEach(() => {
    createStubInstance(Configuration);
    phoneService = createStubInstance(PhoneService);
    stub(LocalStorage, 'getInstance').returns(new LocalStorage());
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
    mockedContainer.withArgs(PhoneRoutes).returns(new PhoneRoutes(phoneService));
  });

  afterEach(() => {
    restore();
  });

  test('should create the right instance', () => {
    const instance = PhoneRoutes.getInstance();
    expect(instance instanceof PhoneRoutes);
  });
});
