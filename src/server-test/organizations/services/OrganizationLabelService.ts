import { SinonStubbedInstance, createStubInstance, restore, stub } from 'sinon';
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';

import { BaseService } from '@/modules/base/services/BaseService';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { OrganizationLabel } from '@/modules/organizations/models/OrganizationLabel';
import { OrganizationLabelDao } from '@/modules/organizations/daos/OrganizationLabelDao';
import { OrganizationLabelService } from '@/modules/organizations/services/OrganizationLabelService';
import { container } from '@/di';
import intern from 'intern';
import { mockMethodWithResult } from '@/utils/utilities';

const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let organizationLabelDAO: SinonStubbedInstance<OrganizationLabelDao>;
  beforeEach(() => {
    organizationLabelDAO = createStubInstance(OrganizationLabelDao);
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

    containerStub.withArgs(OrganizationLabelService).returns(new OrganizationLabelService(organizationLabelDAO));
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
      mockMethodWithResult(organizationLabelDAO, 'create', [{ name: 'test' }], Promise.resolve({ name: 'test' }));

      const result = await container.get(OrganizationLabelService).createLabel({ name: 'test' } as any);
      expect(result).to.deep.equal({ name: 'test' });
    });
  });

  suite('create Bulk Label', () => {
    test('Should success on bulk label creation', async () => {
      (organizationLabelDAO.repository as any) = { persistAndFlush: stub() };
      const wrapEntityStub = stub(BaseService.prototype, 'wrapEntity');
      wrapEntityStub.returns({});

      await container.get(OrganizationLabelService).createBulkLabel(['test'], {} as any);

      expect(wrapEntityStub.callCount).to.equal(1);
    });
  });
});
