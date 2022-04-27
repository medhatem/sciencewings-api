import intern from 'intern';
import { stub, restore } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
import { container } from '@/di';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { MemberService } from '@/modules/hr/services/MemberService';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  beforeEach(() => {
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
  });

  afterEach(() => {
    restore();
  });

  test('should create the right instance', () => {
    const instance = MemberService.getInstance();
    expect(instance instanceof MemberService);
  });
});
