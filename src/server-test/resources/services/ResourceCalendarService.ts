import { SinonStubbedInstance, createStubInstance, restore, stub } from 'sinon';
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';

import { CalendarDao } from '@/modules/reservation/daos/CalendarDAO';
import { CalendarService } from '@/modules/reservation/services/CalendarService';
import { Configuration } from '@/configuration/Configuration';
import { Logger } from '@/utils/Logger';
import { container } from '@/di';
import intern from 'intern';

const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let resourceCalendarDao: SinonStubbedInstance<CalendarDao>;

  beforeEach(() => {
    createStubInstance(Configuration);
    resourceCalendarDao = createStubInstance(CalendarDao);
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
    mockedContainer.withArgs(CalendarService).returns(new CalendarService(resourceCalendarDao));
  });

  afterEach(() => {
    restore();
  });

  test('Should create the right instance', () => {
    const instance = CalendarService.getInstance();
    expect(instance instanceof CalendarService);
  });
});
