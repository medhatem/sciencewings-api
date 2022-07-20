// import intern from 'intern';
// import { stub, restore, SinonStubbedInstance, createStubInstance } from 'sinon';
// const { suite, test } = intern.getPlugin('interface.tdd');
// const { expect } = intern.getPlugin('chai');
// import { afterEach, beforeEach } from 'intern/lib/interfaces/tdd';
// import { container } from '@/di';
// import { Configuration } from '@/configuration/Configuration';
// import { Logger } from '@/utils/Logger';
// import { ContractService } from '@/modules/hr/services/ContractService';
// import { MemberService } from '@/modules/hr/services/MemberService';
// import { UserService } from '@/modules/users/services/UserService';
// import { ContractDao } from '@/modules/hr/daos/ContractDao';
// import { JobService } from '@/modules/hr/services/JobService';
// import { OrganizationService } from '@/modules/organizations/services/OrganizationService';
// import { GroupService } from '@/modules/hr/services/GroupService';
// import { mockMethodWithResult } from '@/utils/utilities';
// import { ResourceCalendarService } from '@/modules/resources/services/ResourceCalendarService';
// import { Result } from '@/utils/Result';
// import { BaseService } from '@/modules/base/services/BaseService';

// suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
//   let groupService: SinonStubbedInstance<GroupService>;
//   let memberService: SinonStubbedInstance<MemberService>;
//   let organizationService: SinonStubbedInstance<OrganizationService>;
//   let jobService: SinonStubbedInstance<JobService>;
//   let resourceCalendarService: SinonStubbedInstance<ResourceCalendarService>;
//   let userService: SinonStubbedInstance<UserService>;
//   let contractDao: SinonStubbedInstance<ContractDao>;

//   beforeEach(() => {
//     groupService = createStubInstance(GroupService);
//     jobService = createStubInstance(JobService);
//     memberService = createStubInstance(MemberService);
//     userService = createStubInstance(UserService);
//     organizationService = createStubInstance(OrganizationService);
//     resourceCalendarService = createStubInstance(ResourceCalendarService);
//     contractDao = createStubInstance(ContractDao);

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
//     mockedContainer
//       .withArgs(ContractService)
//       .returns(
//         new ContractService(
//           contractDao,
//           organizationService,
//           memberService,
//           groupService,
//           jobService,
//           resourceCalendarService,
//           userService,
//         ),
//       );
//   });

//   afterEach(() => {
//     restore();
//   });

//   test('Should create the right instance', () => {
//     const instance = ContractService.getInstance();
//     expect(instance instanceof ContractService);
//   });

//   const payload = {
//     name: 'contract_dash_uno',
//     dateStart: new Date('2022-02-02'),
//     wage: 15000,
//     organization: 1,
//     member: 1,
//     group: 1,
//     job: 1,
//     resourceCalendar: 1,
//     hrResponsible: 1,
//   } as any;

//   suite('create contract', () => {
//     test('Should fail on retriving organization', async () => {
//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok(null)));
//       const result = await container.get(ContractService).createContract(payload);

//       expect(result.isFailure).to.be.true;
//       expect(result.error.message).to.equal(`Organization with id ${payload.organization} does not exist.`);
//     });

//     test('Should fail on retriving member', async () => {
//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(memberService, 'get', [payload.member], Promise.resolve(Result.ok(null)));
//       const result = await container.get(ContractService).createContract(payload);

//       expect(result.isFailure).to.be.true;
//       expect(result.error.message).to.equal(`Memeber with id ${payload.member} does not exist.`);
//     });

//     test('Should fail on retriving group', async () => {
//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(memberService, 'get', [payload.member], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(groupService, 'get', [payload.group], Promise.resolve(Result.ok(null)));
//       const result = await container.get(ContractService).createContract(payload);

//       expect(result.isFailure).to.be.true;
//       expect(result.error.message).to.equal(`Group with id ${payload.member} does not exist.`);
//     });

//     test('Should fail on retriving job', async () => {
//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(memberService, 'get', [payload.member], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(groupService, 'get', [payload.group], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(jobService, 'get', [payload.job], Promise.resolve(Result.ok(null)));
//       const result = await container.get(ContractService).createContract(payload);

//       expect(result.isFailure).to.be.true;
//       expect(result.error.message).to.equal(`Job with id ${payload.job} does not exist.`);
//     });

//     test('Should fail on retriving resourceCalendar', async () => {
//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(memberService, 'get', [payload.member], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(groupService, 'get', [payload.group], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(jobService, 'get', [payload.job], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(
//         resourceCalendarService,
//         'get',
//         [payload.resourceCalendar],
//         Promise.resolve(Result.ok(null)),
//       );
//       const result = await container.get(ContractService).createContract(payload);

//       expect(result.isFailure).to.be.true;
//       expect(result.error.message).to.equal(`Resource Calendar with id ${payload.resourceCalendar} does not exist.`);
//     });

//     test('Should fail on retriving hrResponsible', async () => {
//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(memberService, 'get', [payload.member], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(groupService, 'get', [payload.group], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(jobService, 'get', [payload.job], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(resourceCalendarService, 'get', [payload.resourceCalendar], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(userService, 'get', [payload.hrResponsible], Promise.resolve(Result.ok(null)));
//       const result = await container.get(ContractService).createContract(payload);

//       expect(result.isFailure).to.be.true;
//       expect(result.error.message).to.equal(`HR Responsible with id ${payload.hrResponsible} does not exist.`);
//     });

//     test('Should fail on contract creation', async () => {
//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(memberService, 'get', [payload.member], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(groupService, 'get', [payload.group], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(jobService, 'get', [payload.job], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(resourceCalendarService, 'get', [payload.resourceCalendar], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(userService, 'get', [payload.hrResponsible], Promise.resolve(Result.ok({})));
//       stub(BaseService.prototype, 'create').resolves(Result.fail('StackTrace'));
//       const result = await container.get(ContractService).createContract(payload);

//       expect(result.isFailure).to.be.true;
//       expect(result.error.message).to.equal(`StackTrace`);
//     });
//     test('Should success on contract creation', async () => {
//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(memberService, 'get', [payload.member], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(groupService, 'get', [payload.group], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(jobService, 'get', [payload.job], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(resourceCalendarService, 'get', [payload.resourceCalendar], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(userService, 'get', [payload.hrResponsible], Promise.resolve(Result.ok({})));
//       stub(BaseService.prototype, 'create').resolves(Result.ok({ id: 1 }));
//       const result = await container.get(ContractService).createContract(payload);

//       expect(result.isSuccess).to.be.true;
//       expect(result.getValue()).to.equal(1);
//     });
//   });

//   suite('update contract', () => {
//     const contractID = 1;
//     test('Should fail on retriving contract', async () => {
//       mockMethodWithResult(contractDao, 'get', [contractID], Promise.resolve(null));
//       const result = await container.get(ContractService).updateContract(payload, contractID);

//       expect(result.isFailure).to.be.true;
//       expect(result.error.message).to.equal(`Contract with id ${contractID} does not exist.`);
//     });

//     test('Should fail on retriving organization', async () => {
//       mockMethodWithResult(contractDao, 'get', [contractID], Promise.resolve({}));
//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok(null)));
//       const result = await container.get(ContractService).updateContract(payload, contractID);

//       expect(result.isFailure).to.be.true;
//       expect(result.error.message).to.equal(`Organization with id ${payload.organization} does not exist.`);
//     });

//     test('Should fail on retriving hrResponsible', async () => {
//       mockMethodWithResult(contractDao, 'get', [contractID], Promise.resolve({}));

//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(memberService, 'get', [payload.member], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(groupService, 'get', [payload.group], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(jobService, 'get', [payload.job], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(resourceCalendarService, 'get', [payload.resourceCalendar], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(userService, 'get', [payload.hrResponsible], Promise.resolve(Result.ok(null)));
//       const result = await container.get(ContractService).updateContract(payload, contractID);

//       expect(result.isFailure).to.be.true;
//       expect(result.error.message).to.equal(`HR Responsible with id ${payload.hrResponsible} does not exist.`);
//     });

//     test('Should fail on contract update', async () => {
//       mockMethodWithResult(contractDao, 'get', [contractID], Promise.resolve({}));
//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(memberService, 'get', [payload.member], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(groupService, 'get', [payload.group], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(jobService, 'get', [payload.job], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(resourceCalendarService, 'get', [payload.resourceCalendar], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(userService, 'get', [payload.hrResponsible], Promise.resolve(Result.ok({})));
//       stub(BaseService.prototype, 'wrapEntity').returns({});
//       stub(BaseService.prototype, 'update').resolves(Result.fail('StackTrace'));
//       const result = await container.get(ContractService).updateContract(payload, contractID);

//       expect(result.isFailure).to.be.true;
//       expect(result.error.message).to.equal(`StackTrace`);
//     });

//     test('Should success on contract update with minimal payload', async () => {
//       mockMethodWithResult(contractDao, 'get', [contractID], Promise.resolve({}));
//       stub(BaseService.prototype, 'wrapEntity').returns({});
//       stub(BaseService.prototype, 'update').resolves(Result.ok({ id: 1 }));
//       const result = await container.get(ContractService).updateContract({} as any, contractID);

//       expect(result.isSuccess).to.be.true;
//       expect(result.getValue()).to.equal(1);
//     });
//     test('Should success on contract update', async () => {
//       mockMethodWithResult(contractDao, 'get', [contractID], Promise.resolve({}));
//       mockMethodWithResult(organizationService, 'get', [payload.organization], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(memberService, 'get', [payload.member], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(groupService, 'get', [payload.group], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(jobService, 'get', [payload.job], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(resourceCalendarService, 'get', [payload.resourceCalendar], Promise.resolve(Result.ok({})));
//       mockMethodWithResult(userService, 'get', [payload.hrResponsible], Promise.resolve(Result.ok({})));
//       stub(BaseService.prototype, 'wrapEntity').returns({});
//       stub(BaseService.prototype, 'update').resolves(Result.ok({ id: 1 }));
//       const result = await container.get(ContractService).updateContract(payload, contractID);

//       expect(result.isSuccess).to.be.true;
//       expect(result.getValue()).to.equal(1);
//     });
//   });
// });
