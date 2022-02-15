import { CreateContractSchema, UpdateContractSchema } from '../schemas/ContractSchema';
import { IGroupService, IJobService, IMemberService } from '../interfaces';
import { container, provideSingleton } from '@di/index';

import { BaseService } from '../../base/services/BaseService';
import { Contract } from '../../hr/models/Contract';
import { ContractDao } from '../daos/ContractDao';
import { ContractRO } from '../routes/RequestObject';
import { IContractService } from '../interfaces/IContractService';
import { IOrganizationService } from '../../organizations/interfaces';
import { IResourceCalendarService } from '../../resources/interfaces';
import { IUserService } from '../../users/interfaces';
import { Result } from './../../../utils/Result';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';
import { validate } from '@/decorators/bodyValidationDecorators/validate';

@provideSingleton(IContractService)
export class ContractService extends BaseService<Contract> implements IContractService {
  constructor(
    public dao: ContractDao,
    public origaniaztionService: IOrganizationService,
    public memberService: IMemberService,
    public groupService: IGroupService,
    public jobService: IJobService,
    public resourceCalendarSerivce: IResourceCalendarService,
    public userService: IUserService,
  ) {
    super(dao);
  }

  static getInstance(): IContractService {
    return container.get(IContractService);
  }

  /**
   * Check where the optional properties does exists
   * @param payload
   * @returns Optional Properties
   */
  private async checkForOptionalPropertiesInContract(payload: ContractRO): Promise<Result<any>> {
    let member, group, job, resourceCalendar, hrResponsible;
    if (payload.member) {
      member = await this.memberService.get(payload.member);
      if (member.isFailure || member.getValue() === null)
        return Result.fail<number>(`Memeber with id ${payload.member} does not exist.`);
      member = await member.getValue();
    }
    if (payload.group) {
      group = await this.groupService.get(payload.member);
      if (group.isFailure || group.getValue() === null)
        return Result.fail<number>(`Group with id ${payload.group} does not exist.`);
      group = await group.getValue();
    }
    if (payload.job) {
      job = await this.jobService.get(payload.member);
      if (job.isFailure || job.getValue() === null)
        return Result.fail<number>(`Job with id ${payload.job} does not exist.`);
      job = await job.getValue();
    }
    if (payload.resourceCalendar) {
      resourceCalendar = await this.resourceCalendarSerivce.get(payload.resourceCalendar);
      if (member.isFailure || member.getValue() === null)
        return Result.fail<number>(`Resource Calendar with id ${payload.resourceCalendar} does not exist.`);
      resourceCalendar = await resourceCalendar.getValue();
    }
    // if (payload.contractType) {
    // }
    if (payload.hrResponsible) {
      hrResponsible = await this.userService.get(payload.hrResponsible);
      if (hrResponsible.isFailure || hrResponsible.getValue() === null)
        return Result.fail<number>(`HR Responsible with id ${payload.hrResponsible} does not exist.`);
      hrResponsible = await hrResponsible.getValue();
    }
    return Result.ok({ member, group, job, resourceCalendar, hrResponsible });
  }

  @log()
  @safeGuard()
  @validate(CreateContractSchema)
  public async createContract(payload: ContractRO): Promise<Result<number>> {
    const organization = await this.origaniaztionService.get(payload.organization);
    if (organization.isFailure || organization.getValue() === null) {
      return Result.fail<number>(`Organization with id ${payload.organization} does not exist.`);
    }

    const resEntities = await this.checkForOptionalPropertiesInContract(payload);
    if (resEntities.isFailure) {
      return resEntities;
    }
    const entities = await resEntities.getValue();

    const contract = {
      ...payload,
      organization: await organization.getValue(),
      ...entities,
    };

    const createdContract = await this.create(contract);

    if (createdContract.isFailure) {
      return createdContract;
    }
    return Result.ok(createdContract.getValue().id);
  }

  @log()
  @safeGuard()
  @validate(UpdateContractSchema)
  public async updateContract(payload: ContractRO, id: number): Promise<Result<number>> {
    const currentContract = await this.dao.get(id);
    if (currentContract === null) {
      return Result.fail<number>(`Contract with id ${id} does not exist.`);
    }

    let organization;
    if (payload.organization) {
      organization = await this.origaniaztionService.get(payload.organization);
      if (organization.isFailure || organization.getValue() === null) {
        return Result.fail<number>(`Organization with id ${payload.organization} does not exist.`);
      }
      organization = await organization.getValue();
    }

    const resEntities = await this.checkForOptionalPropertiesInContract(payload);
    if (resEntities.isFailure) {
      return resEntities;
    }
    const entities = await resEntities.getValue();

    const contract = this.wrapEntity(currentContract, {
      ...currentContract,
      ...payload,
      organization: organization ? organization : currentContract.organization,
      ...entities,
    });

    const updatedContract = await this.create(contract);

    if (updatedContract.isFailure) {
      return updatedContract;
    }
    return Result.ok(updatedContract.getValue().id);
  }
}
