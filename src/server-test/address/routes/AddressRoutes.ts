import intern from 'intern';
import { stub, restore, SinonStubbedInstance, createStubInstance } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { container } from '@/di';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { LocalStorage } from '@/utils/LocalStorage';
import { AddressService } from '@/modules/address/services/AddressService';
import { AddressRoutes } from '@/modules/address/routes/AddressRoutes';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let addressService: SinonStubbedInstance<AddressService>;
  beforeEach(() => {
    createStubInstance(Configuration);
    addressService = createStubInstance(AddressService);
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
    mockedContainer.withArgs(AddressRoutes).returns(new AddressRoutes(addressService));
  });

  afterEach(() => {
    restore();
  });

  test('Should create the right instance', () => {
    const instance = AddressRoutes.getInstance();
    expect(instance instanceof AddressRoutes);
  });
});
