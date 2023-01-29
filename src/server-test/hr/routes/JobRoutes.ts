import { SinonStubbedInstance, createStubInstance, restore, stub } from 'sinon';
import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';

import { Configuration } from '@/configuration/Configuration';
import { CreateContractRO } from '@/modules/hr/routes/RequestObject';
import { JobRoutes } from '@/modules/hr/routes/JobRoutes';
import { JobService } from '@/modules/hr/services/JobService';
import { LocalStorage } from '@/utils/LocalStorage';
import { Logger } from '@/utils/Logger';
import { container } from '@/di';
import intern from 'intern';
import { mockMethodWithResult } from '@/utils/utilities';

const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let jobService: SinonStubbedInstance<JobService>;
  let jobRoutes: JobRoutes;
  beforeEach(() => {
    createStubInstance(Configuration);
    jobService = createStubInstance(JobService);
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
    mockedContainer.withArgs(JobRoutes).returns(new JobRoutes(jobService));
    jobRoutes = container.get(JobRoutes);
  });

  afterEach(() => {
    restore();
  });

  test('Should create the right instance', () => {
    const instance = JobRoutes.getInstance();
    expect(instance instanceof JobRoutes);
  });
  suite('POST jobs/create', () => {
    const payload = new CreateContractRO();

    test('Should fail on throw error', async () => {
      mockMethodWithResult(jobService, 'createJob', [payload], Promise.reject(new Error('Failed')));
      try {
        await jobRoutes.createJob(payload);
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should success at returning the right value', async () => {
      mockMethodWithResult(jobService, 'createJob', [payload], 1);
      const result = await jobRoutes.createJob(payload);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(201);
    });
  });

  suite('PUT jobs/update/:id', () => {
    const payload = new CreateContractRO();

    test('Should fail on throw error', async () => {
      mockMethodWithResult(jobService, 'updateJob', [payload, 1], Promise.reject(new Error('Failed')));
      try {
        await jobRoutes.updateJob(payload, 1);
      } catch (error) {
        expect(error.message).to.equal('Failed');
      }
    });
    test('Should success at updating and returning the right value', async () => {
      mockMethodWithResult(jobService, 'updateJob', [payload, 1], 1);
      const result = await jobRoutes.updateJob(payload, 1);
      expect(result.body.id).to.equal(1);
      expect(result.body.statusCode).to.equal(204);
    });
  });
});
