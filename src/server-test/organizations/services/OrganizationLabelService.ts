import intern from 'intern';
import { stub, restore, createStubInstance, SinonStubbedInstance } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { container } from '@/di';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { OrganizationLabel } from '@/modules/organizations/models/OrganizationLabel';
import { OrganizationLabelDao } from '@/modules/organizations/daos/OrganizationLabelDao';
import { OrganizationLabelService } from '@/modules/organizations/services/OrganizationLabelService';
import { mockMethodWithResult } from '@/utils/utilities';
import { BaseService } from '@/modules/base/services/BaseService';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let organizationLabelDAO: SinonStubbedInstance<OrganizationLabelDao>;
  beforeEach(() => {
    organizationLabelDAO = createStubInstance(OrganizationLabelDao);
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

    _container.withArgs(OrganizationLabelService).returns(new OrganizationLabelService(organizationLabelDAO));
  });

  afterEach(() => {
    restore();
  });

  test('Should create the right instance', () => {
    const instance = OrganizationLabel.getInstance();
    expect(instance instanceof OrganizationLabel);
  });

  suite('create Label', () => {
    test('Should success on label creation', async () => {
      mockMethodWithResult(organizationLabelDAO, 'create', [], Promise.resolve({ id: 1 }));

      const result = await container.get(OrganizationLabelService).createLabel({} as any);
      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.equal(1);
    });
  });

  suite('create Bulk Label', () => {
    test('Should success on bulk label creation', async () => {
      (organizationLabelDAO.repository as any) = { persistAndFlush: stub() };
      stub(BaseService.prototype, 'wrapEntity').returns({});
      const result = await container.get(OrganizationLabelService).createBulkLabel(['test'], {} as any);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.equal(200);
    });
  });
});
