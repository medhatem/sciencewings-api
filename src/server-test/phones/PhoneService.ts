import intern from 'intern';
import { stub, restore, createStubInstance, SinonStubbedInstance } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { container } from '@/di';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { PhoneService } from '@/modules/phones/services/PhoneService';
import { PhoneDao } from '@/modules/phones/daos/PhoneDAO';
import { BaseService } from '@/modules/base';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let phoneDAO: SinonStubbedInstance<PhoneDao>;
  beforeEach(() => {
    phoneDAO = createStubInstance(PhoneDao);
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
    _container.withArgs(PhoneService).returns(new PhoneService(phoneDAO));
    stub(BaseService.prototype, 'wrapEntity').returns({});
    (phoneDAO.repository as any) = { persist: stub() };
  });

  afterEach(() => {
    restore();
  });

  test('should create the right instance', () => {
    const instance = PhoneService.getInstance();
    expect(instance instanceof PhoneService);
  });

  suite('createBulkPhoneForUser', () => {
    test('Should success on creation', async () => {
      const result = await container.get(PhoneService).createBulkPhoneForUser([] as any, {} as any);
      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.equal(200);
    });
  });

  suite('createBulkPhoneForOrganization', () => {
    test('Should success on creation', async () => {
      const result = await container.get(PhoneService).createBulkPhoneForOrganization([] as any, {} as any);
      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.equal(200);
    });
  });
});
