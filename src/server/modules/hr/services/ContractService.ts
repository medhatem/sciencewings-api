import { IGroupService } from '@/modules/hr/interfaces/IGroupService';
import { IJobService } from '@/modules/hr/interfaces/IJobService';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { Contract, ContractTypes } from '@/modules/hr/models/Contract';
import { ContractDao } from '@/modules/hr/daos/ContractDao';
import { CreateContractRO } from '@/modules/hr/routes/RequestObject';
import { IContractService } from '@/modules/hr/interfaces/IContractService';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { IResourceCalendarService } from '@/modules/resources/interfaces/IResourceCalendarService';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { log } from '@/decorators/log';
import { validate } from '@/decorators/validate';
import { validateParam } from '@/decorators/validateParam';
import { CreateContractSchema, UpdateContractSchema } from '@/modules/hr/schemas/ContractSchema';
import { NotFoundError } from '@/Exceptions/NotFoundError';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { JobState, Job } from '@/modules/hr/models/Job';
import { ValidationError } from '@/Exceptions/ValidationError';

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
   * check the existence of optional properties for a given contract
   * @param payload
   * @returns Optional Properties
   */
  @log()
  private async checkForOptionalPropertiesInContract(payload: any): Promise<any> {
    let member, group, job, resourceCalendar, hrResponsible;
    if (payload.member) {
      member = await this.memberService.get(payload.member);
      if (!member) {
        throw new NotFoundError('MEMBER.NON_EXISTANT {{member}}', { variables: { member: `${payload.member}` } });
      }
    }
    if (payload.group) {
      group = await this.groupService.get(payload.member);
      if (!group) {
        throw new NotFoundError('GROUP.NON_EXISTANT {{group}}', { variables: { group: `${payload.group}` } });
      }
    }
    if (payload.job) {
      job = await this.jobService.get(payload.member);
      if (!job) {
        throw new NotFoundError('JOB.NON_EXISTANT {{job}}', { variables: { job: `${payload.job}` } });
      }
    }
    if (payload.resourceCalendar) {
      resourceCalendar = await this.resourceCalendarSerivce.get(payload.resourceCalendar);
      if (!resourceCalendar) {
        throw new NotFoundError('RESOURCE_CALENDAR.NON_EXISTANT {{calendar}}', {
          variables: { calendar: `${payload.resourceCalendar}` },
        });
      }
    }
    if (payload.hrResponsible) {
      hrResponsible = await this.userService.get(payload.hrResponsible);
      if (!hrResponsible) {
        throw new NotFoundError('MEMBER.NON_EXISTANT {{member}}', {
          variables: { member: `${payload.hrResponsible}` },
        });
      }
    }
    return { member, group, job, resourceCalendar, hrResponsible };
  }

  /**
   * Override the create method
   */
  @log()
  @validate
  public async createContract(@validateParam(CreateContractSchema) payload: CreateContractRO): Promise<number> {
    const organization = await this.origaniaztionService.get(payload.organization);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_{{org}}', {
        variables: { org: `${payload.organization}` },
        isOperational: true,
        friendly: true,
      });
    }
    const user = await this.userService.get(payload.user);

    if (!user) {
      throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', {
        variables: { user: `${payload.user}` },
        friendly: true,
      });
    }

    const member = await this.memberService.getByCriteria({ user, organization }, FETCH_STRATEGY.SINGLE);
    if (!member) {
      throw new NotFoundError('MEMBER.NON_EXISTANT {{member}}', {
        variables: { member: `${payload.user}` },
        friendly: true,
      });
    }
    const wrappedContract = this.wrapEntity(Contract.getInstance(), {
      jobLevel: payload.jobLevel,
      wage: payload.wage,
      dateStart: payload.dateStart,
      description: payload.description,
    });

    wrappedContract.member = member;
    if (payload.dateEnd && payload.contractType !== ContractTypes.CONTRACT_BASE) {
      throw new ValidationError('VALIDATION.DATEEND.PROVIDED_WITHOUT_CONTRACT_BASE_REQUIRED', { friendly: true });
    }

    if (payload.contractType) {
      if (payload.contractType === ContractTypes.CONTRACT_BASE) {
        if (payload.dateEnd) {
          wrappedContract.contractType = payload.contractType;
          wrappedContract.dateEnd = payload.dateEnd;
        } else {
          throw new ValidationError('VALIDATION.DATEEND_REQUIRED', { friendly: true });
        }
      } else {
        wrappedContract.contractType = payload.contractType;
      }
    }

    if (payload.supervisor) {
      const user = await this.userService.get(payload.supervisor);

      if (!user) {
        throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', {
          variables: { user: `${payload.user}` },
          friendly: true,
        });
      }

      const supervisor = await this.memberService.getByCriteria({ user, organization }, FETCH_STRATEGY.SINGLE);
      if (!supervisor) {
        throw new NotFoundError('MEMBER.NON_EXISTANT {{member}}', {
          variables: { member: `${payload.user}` },
          friendly: true,
        });
      }
      wrappedContract.supervisor = supervisor;
    }

    const createdContract = await this.dao.create(wrappedContract);

    const wrappedJob = this.jobService.wrapEntity(Job.getInstance(), {
      name: payload.name,
      state: JobState.WORKING,
    });
    wrappedJob.organization = organization;
    const job = await this.jobService.create(wrappedJob);
    await job.contracts.init();
    job.contracts.add(createdContract);
    await this.jobService.update(job);

    return createdContract.id;
  }

  /**
   * Override the update method
   */
  @log()
  @validate
  public async updateContract(
    @validateParam(UpdateContractSchema) payload: CreateContractRO,
    id: number,
  ): Promise<number> {
    const currentContract = await this.dao.get(id);
    if (currentContract === null) {
      throw new NotFoundError('CONTRACT.NON_EXISTANT {{contract}}', { variables: { contract: `${id}` } });
    }

    let organization;
    if (payload.organization) {
      organization = await this.origaniaztionService.get(payload.organization);
      if (!organization) {
        throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${payload.organization}` } });
      }
    }

    const entities = await this.checkForOptionalPropertiesInContract(payload);

    const contract = this.wrapEntity(currentContract, {
      ...currentContract,
      ...payload,
      organization: organization,
      ...entities,
    });

    const updatedContract = await this.update(contract);

    return updatedContract.id;
  }
}
