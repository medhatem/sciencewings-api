import { SinonStubbedInstance, createStubInstance, restore, stub } from 'sinon';
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';

import { AddressDao } from '@/modules/address/daos/AddressDAO';
import { AddressService } from '@/modules/address/services/AddressService';
import { BaseService } from '@/modules/base/services/BaseService';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { container } from '@/di';
import intern from 'intern';
import { mockMethodWithResult } from '@/utils/utilities';

const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let addressDAO: SinonStubbedInstance<AddressDao>;
  beforeEach(() => {
    addressDAO = createStubInstance(AddressDao);
    const containerStub = stub(container, 'get');
    containerStub.withArgs(Configuration).returns({
      getConfiguration: stub(),
      currentENV: 'test',
    });
    containerStub.withArgs(Logger).returns({
      setup: stub(),
      info: stub(),
      error: stub(),
      warn: stub(),
    });
    containerStub.withArgs(AddressService).returns(new AddressService(addressDAO));
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
      mockMethodWithResult(addressDAO, 'create', [], Promise.reject(new Error('Failed')));
      try {
        await container.get(AddressService).createAddress({} as any);
        expect.fail('unexpected success');
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should success on address creation', async () => {
      stub(BaseService.prototype, 'wrapEntity').returns({});
      mockMethodWithResult(addressDAO, 'create', [], { id: 1 });

      const result = await container.get(AddressService).createAddress({} as any);
      expect(result.id).to.equal(1);
    });
  });
});
