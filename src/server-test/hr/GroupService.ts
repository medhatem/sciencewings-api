import intern from 'intern';
import { stub, restore, SinonStubbedInstance, createStubInstance } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { container } from '@/di';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { GroupService } from '@/modules/hr/services/GroupService';
import { GroupDAO } from '@/modules/hr/daos/GroupDAO';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let groupDAO: SinonStubbedInstance<GroupDAO>;

  beforeEach(() => {
    groupDAO = createStubInstance(GroupDAO);
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
    _container.withArgs(GroupService).returns(new GroupService(groupDAO));
  });

  afterEach(() => {
    restore();
  });

  test('should create the right instance', () => {
    const instance = GroupService.getInstance();
    expect(instance instanceof GroupService);
  });
});
