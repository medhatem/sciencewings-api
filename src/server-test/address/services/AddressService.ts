import intern from 'intern';
import { stub, restore, createStubInstance, SinonStubbedInstance } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { container } from '@/di';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { AddressService } from '@/modules/address/services/AddressService';
import { AddressDao } from '@/modules/address/daos/AddressDAO';
import { BaseService } from '@/modules/base/services/BaseService';
import { mockMethodWithResult } from '@/utils/utilities';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let addressDAO: SinonStubbedInstance<AddressDao>;
  beforeEach(() => {
    addressDAO = createStubInstance(AddressDao);
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
    _container.withArgs(AddressService).returns(new AddressService(addressDAO));
  });

  afterEach(() => {
    restore();
  });

  test('Should create the right instance', () => {
    const instance = AddressService.getInstance();
    expect(instance instanceof AddressService);
  });

  suite('create Address', () => {
    test('Should fail on address creation', async () => {
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(addressDAO, 'create', [], Promise.reject('stackTrace'));

      const result = await container.get(AddressService).createAddress({} as any);
      expect(result.isFailure).to.be.true;
      expect(result.error.message).to.equal('stackTrace');
    });
    test('Should success on address creation', async () => {
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(addressDAO, 'create', [], { id: 1 });

      const result = await container.get(AddressService).createAddress({} as any);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue().id).to.equal(1);
    });
  });
});
