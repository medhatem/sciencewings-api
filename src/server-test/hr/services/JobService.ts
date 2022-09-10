// import intern from 'intern';
// import { stub, restore, SinonStubbedInstance, createStubInstance } from 'sinon';
// const { suite, test } = intern.getPlugin('interface.tdd');
// const { expect } = intern.getPlugin('chai');
// import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
// import { container } from '@/di';
// import { Configuration } from '@/configuration/Configuration';
// import { Logger } from '@/utils/Logger';
// import { JobService } from '@/modules/hr/services/JobService';
// import { OrganizationService } from '@/modules/organizations/services/OrganizationService';
// import { mockMethodWithResult } from '@/utils/utilities';
// import { Result } from '@/utils/Result';
// import { JobRO } from '@/modules/hr/routes/RequestObject';
// import { JobDAO } from '@/modules/hr/daos/JobDAO';
// import { BaseService } from '@/modules/base/services/BaseService';

// suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
//   let organizationService: SinonStubbedInstance<OrganizationService>;
//   let jobDAO: SinonStubbedInstance<JobDAO>;

//   beforeEach(() => {
//     organizationService = createStubInstance(OrganizationService);
//     jobDAO = createStubInstance(JobDAO);

//     const mockedContainer = stub(container, 'get');
//     mockedContainer.withArgs(Configuration).returns({
//       getConfiguration: stub(),
//       currentENV: 'test',
//     });
//     mockedContainer.withArgs(Logger).returns({
//       setup: stub(),
//       info: stub(),
//       error: stub(),
//       warn: stub(),
//     });
//     mockedContainer.withArgs(JobService).returns(new JobService(jobDAO, organizationService));
//   });

//   afterEach(() => {
//     restore();
//   });

//   test('Should create the right instance', () => {
//     const instance = JobService.getInstance();
//     expect(instance instanceof JobService);
//   });

//   const payload: JobRO = {
//     name: 'job uno title',
//     description: 'job uno desc',
//     state: 'job uno stat',
//     organization: 1,
//   };

//   suite('create job', () => {
//     test('Should fail on retriving organization', async () => {
//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok(null)));
//       const result = await container.get(JobService).createJob(payload);

//       expect(result.isFailure).to.be.true;
//       expect(result.error.message).to.equal(`Organization with id ${payload.organization} does not exist`);
//     });
//     test('Should fail on job creation', async () => {
//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok({})));
//       stub(BaseService.prototype, 'wrapEntity').returns({});
//       stub(BaseService.prototype, 'create').resolves(Result.fail('StackTrace'));
//       const result = await container.get(JobService).createJob(payload);

//       expect(result.isFailure).to.be.true;
//       expect(result.error.message).to.equal(`StackTrace`);
//     });
//     test('Should success on job creation', async () => {
//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok({})));
//       stub(BaseService.prototype, 'wrapEntity').returns({});
//       stub(BaseService.prototype, 'create').resolves(Result.ok({ id: 1 }));
//       const result = await container.get(JobService).createJob(payload);

//       expect(result.isSuccess).to.be.true;
//       expect(result.getValue()).to.equal(1);
//     });
//     test('Should success on job creation without organization', async () => {
//       const payloadWithoutProp = { ...payload };
//       delete payloadWithoutProp.organization;

//       mockMethodWithResult(organizationService, 'get', [], Promise.resolve(null));
//       stub(BaseService.prototype, 'wrapEntity').returns({});
//       stub(BaseService.prototype, 'create').resolves(Result.ok({ id: 1 }));
//       const result = await container.get(JobService).createJob(payloadWithoutProp);

//       expect(result.isSuccess).to.be.true;
//       expect(result.getValue()).to.equal(1);
//     });
//   });
//   suite('update job', async () => {
//     const jobId = 1;
//     test('Should fail on retriving job', async () => {
//       mockMethodWithResult(jobDAO, 'get', [jobId], Promise.resolve(null));
//       const result = await container.get(JobService).updateJob(payload, jobId);

//       expect(result.isFailure).to.be.true;
//       expect(result.error.message).to.equal(`Job with id ${jobId} does not exist`);
//     });
//     test('Should fail on retriving organization', async () => {
//       mockMethodWithResult(jobDAO, 'get', [jobId], Promise.resolve({}));
//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok(null)));
//       const result = await container.get(JobService).updateJob(payload, jobId);

//       expect(result.isFailure).to.be.true;
//       expect(result.error.message).to.equal(`Organization with id ${payload.organization} does not exist`);
//     });
//     test('Should fail on job update', async () => {
//       mockMethodWithResult(jobDAO, 'get', [jobId], Promise.resolve({}));
//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok({})));
//       stub(BaseService.prototype, 'wrapEntity').returns({});
//       stub(BaseService.prototype, 'update').resolves(Result.fail('StackTrace'));
//       const result = await container.get(JobService).updateJob(payload, jobId);

//       expect(result.isFailure).to.be.true;
//       expect(result.error.message).to.equal(`StackTrace`);
//     });
//     test('Should success on job update', async () => {
//       mockMethodWithResult(jobDAO, 'get', [jobId], Promise.resolve({}));
//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok({})));
//       stub(BaseService.prototype, 'wrapEntity').returns({});
//       stub(BaseService.prototype, 'update').resolves(Result.ok({ id: 1 }));
//       const result = await container.get(JobService).updateJob(payload, jobId);

//       expect(result.isSuccess).to.be.true;
//       expect(result.getValue()).to.equal(1);
//     });
//     test('Should success on job update without organization', async () => {
//       const payloadWithoutProp = { ...payload };
//       delete payloadWithoutProp.organization;

//       mockMethodWithResult(jobDAO, 'get', [jobId], Promise.resolve({}));
//       mockMethodWithResult(organizationService, 'get', [], Promise.resolve(null));
//       stub(BaseService.prototype, 'wrapEntity').returns({});
//       stub(BaseService.prototype, 'update').resolves(Result.ok({ id: 1 }));
//       const result = await container.get(JobService).updateJob(payloadWithoutProp, jobId);

//       expect(result.isSuccess).to.be.true;
//       expect(result.getValue()).to.equal(1);
//     });
//   });
// });
