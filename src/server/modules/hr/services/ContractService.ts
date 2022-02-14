import { Result } from './../../../utils/Result';
import { container, provideSingleton } from '@di/index';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';
import { validate } from '../../../decorators/bodyValidationDecorators/validate';
import { BaseService } from '../../base/services/BaseService';
import { Contract } from '../../hr/models/Contract';
import { ContractDao } from '../daos/ContractDao';
import { IContractService } from '../interfaces/IContractService';
import { ContractRO } from '../routes/RequestObject';
import { CreateContractSchema, UpdateContractSchema } from '../schemas/ContractSchema';
import { IOrganizationService } from '../../organizations/interfaces';
import { IUserService } from '../../users/interfaces';
import { IGroupService, IMemberService, IJobService } from '../interfaces';
import { IResourceCalendarService } from '../../resources/interfaces';

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

  private async checkOptionalEntities(payload: ContractRO): Promise<Result<any>> {
    let member, group, job, resourceCalendar, hrResponsible;
    if (payload.member) {
      member = await this.memberService.get(payload.member);
      if (member.isFailure || member.getValue() === null)
        return Result.fail<number>(`Memeber with id ${payload.member} dose not exist.`);
      member = await member.getValue();
    }
    if (payload.group) {
      group = await this.groupService.get(payload.member);
      if (group.isFailure || group.getValue() === null)
        return Result.fail<number>(`Group with id ${payload.group} dose not exist.`);
      group = await group.getValue();
    }
    if (payload.job) {
      job = await this.jobService.get(payload.member);
      if (job.isFailure || job.getValue() === null)
        return Result.fail<number>(`Job with id ${payload.job} dose not exist.`);
      job = await job.getValue();
    }
    if (payload.resourceCalendar) {
      resourceCalendar = await this.resourceCalendarSerivce.get(payload.resourceCalendar);
      if (member.isFailure || member.getValue() === null)
        return Result.fail<number>(`Resource Calendar with id ${payload.resourceCalendar} dose not exist.`);
      resourceCalendar = await resourceCalendar.getValue();
    }
    // if (payload.contractType) {
    // }
    if (payload.hrResponsible) {
      hrResponsible = await this.userService.get(payload.hrResponsible);
      if (hrResponsible.isFailure || hrResponsible.getValue() === null)
        return Result.fail<number>(`HR Responsible with id ${payload.hrResponsible} dose not exist.`);
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
      return Result.fail<number>(`Organization with id ${payload.organization} dose not exist.`);
    }

    const resEntities = await this.checkOptionalEntities(payload);
    if (resEntities.isFailure) {
      return Result.fail<number>(resEntities.error);
    }
    const entities = await resEntities.getValue();

    const contract = {
      ...payload,
      organization: await organization.getValue(),
      ...entities,
    };
    console.log({ contract });

    const createdContract = await this.create(contract);

    if (createdContract.isFailure) {
      return Result.fail<number>(createdContract.error);
    }
    return Result.ok(createdContract.getValue().id);
  }

  @log()
  @safeGuard()
  @validate(UpdateContractSchema)
  public async updateContract(payload: ContractRO, id: number): Promise<Result<number>> {
    const currentContract = await this.dao.get(id);
    if (currentContract === null) {
      return Result.fail<number>(`Contract with id ${id} dose not exist.`);
    }

    let organization;
    if (payload.organization) {
      organization = await this.origaniaztionService.get(payload.organization);
      if (organization.isFailure || organization.getValue() === null) {
        return Result.fail<number>(`Organization with id ${payload.organization} dose not exist.`);
      }
      organization = await organization.getValue();
    }

    const resEntities = await this.checkOptionalEntities(payload);
    if (resEntities.isFailure) {
      return Result.fail<number>(resEntities.error);
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
      return Result.fail<number>(updatedContract.error);
    }
    return Result.ok(updatedContract.getValue().id);
  }
}
