import { IGroupService } from '@/modules/hr/interfaces/IGroupService';
import { IJobService } from '@/modules/hr/interfaces/IJobService';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { Contract, ContractTypes } from '@/modules/hr/models/Contract';
import { ContractDao } from '@/modules/hr/daos/ContractDao';
import { CreateContractRO, UpdateContractRO } from '@/modules/hr/routes/RequestObject';
import { IContractService } from '@/modules/hr/interfaces/IContractService';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { ICalendarService } from '@/modules/reservation/interfaces/ICalendarService';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { log } from '@/decorators/log';
import { validate } from '@/decorators/validate';
import { validateParam } from '@/decorators/validateParam';
import { CreateContractSchema, UpdateContractSchema } from '@/modules/hr/schemas/ContractSchema';
import { NotFoundError } from '@/Exceptions/NotFoundError';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { JobState, Job } from '@/modules/hr/models/Job';
import { ValidationError } from '@/Exceptions/ValidationError';
import { paginate } from '@/utils/utilities';
import { ContractsList } from '@/types/types';

@provideSingleton(IContractService)
export class ContractService extends BaseService<Contract> implements IContractService {
  constructor(
    public dao: ContractDao,
    public origaniaztionService: IOrganizationService,
    public memberService: IMemberService,
    public groupService: IGroupService,
    public jobService: IJobService,
    public resourceCalendarSerivce: ICalendarService,
    public userService: IUserService,
  ) {
    super(dao);
  }

  static getInstance(): IContractService {
    return container.get(IContractService);
  }

  /**
   * Retrieve all member contracts
   * @param orgId of organization id
   * @param userId of user id
   */
  @log()
  public async getAllMemberContracts(
    orgId: number,
    userId: number,
    page?: number,
    size?: number,
  ): Promise<ContractsList> {
    const organization = await this.origaniaztionService.get(orgId);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_{{org}}', {
        variables: { org: `${orgId}` },
        isOperational: true,
      });
    }
    const user = await this.userService.get(userId);

    if (!user) {
      throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', { variables: { user: `${userId}` } });
    }

    const member = await this.memberService.getByCriteria({ user, organization }, FETCH_STRATEGY.SINGLE);
    if (!member) {
      throw new NotFoundError('MEMBER.NON_EXISTANT {{member}}', { variables: { member: `${userId}` } });
    }

    const length = await this.dao.count({ member });

    let contracts;
    if (page | size) {
      const skip = page * size;
      contracts = (await this.dao.getByCriteria({ member }, FETCH_STRATEGY.ALL, {
        populate: ['job', 'supervisor'] as never,
        offset: skip,
        limit: size,
      })) as Contract[];

      const { data, pagination } = paginate(contracts, page, size, skip, length);
      const result: ContractsList = {
        data,
        pagination,
      };
      return result;
    }

    contracts = (await this.dao.getByCriteria({ member }, FETCH_STRATEGY.ALL, {
      populate: ['job', 'supervisor'] as never,
    })) as Contract[];

    const result: ContractsList = {
      data: contracts,
    };
    return result;
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

    //should create ck permissions that are related to the created organization
    return createdContract.id;
  }

  /**
   * Override the update method
   * @param orgId of organization id
   * @param userId of user id
   */

  @log()
  @validate
  public async updateContract(
    @validateParam(UpdateContractSchema) payload: UpdateContractRO,
    id: number,
  ): Promise<number> {
    const contract = await this.dao.get(id);
    if (!contract) {
      throw new NotFoundError('CONTRACT.NON_EXISTANT {{contract}}', {
        variables: { contract: `${id}` },
        friendly: true,
      });
    }
    const wrappedContract = this.wrapEntity(contract, {
      ...Contract,
      jobLevel: payload?.jobLevel || contract.jobLevel,
      wage: payload?.wage || contract.wage,
      dateStart: payload?.dateStart || contract.dateStart,
      description: payload?.description || contract.description,
    });
    if (payload.supervisor && contract.supervisor && contract.supervisor.user.id !== payload.supervisor) {
      const organization = await this.origaniaztionService.get(payload.organization);

      if (!organization) {
        throw new NotFoundError('ORG.NON_EXISTANT_{{org}}', {
          variables: { org: `${payload.organization}` },
          isOperational: true,
          friendly: true,
        });
      }
      const user = await this.userService.get(payload.supervisor);
      if (!user) {
        throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', {
          variables: { user: `${payload.supervisor}` },
          friendly: true,
        });
      }

      const supervisor = await this.memberService.getByCriteria({ user, organization }, FETCH_STRATEGY.SINGLE);
      if (!supervisor) {
        throw new NotFoundError('MEMBER.NON_EXISTANT {{member}}', {
          variables: { member: `${payload.supervisor}` },
          friendly: true,
        });
      }
      wrappedContract.supervisor = supervisor;
    }
    if (payload.contractType) {
      if (payload.contractType === ContractTypes.PERMANANT) {
        wrappedContract.contractType = payload.contractType;
        wrappedContract.dateEnd = null;
      }
      if (payload.contractType === ContractTypes.CONTRACT_BASE) {
        if (payload.dateEnd) {
          wrappedContract.contractType = payload.contractType;
        } else {
          throw new ValidationError('VALIDATION.DATEEND_REQUIRED', { friendly: true });
        }
      }
    }
    if (payload.dateEnd) {
      if (wrappedContract.contractType === ContractTypes.CONTRACT_BASE) {
        wrappedContract.dateEnd = payload.dateEnd;
      } else {
        throw new ValidationError('VALIDATION.DATEEND_JUST_IN_CONTRACT_BASE', { friendly: true });
      }
    }
    const updatedContract = await this.update(wrappedContract);

    if (
      (payload.jobName || payload.state) &&
      (payload.jobName !== contract.job.name || payload.state !== contract.job.state)
    ) {
      const job = (await this.jobService.getByCriteria({ contracts: contract }, FETCH_STRATEGY.SINGLE)) as Job;
      const wrappedJob = this.jobService.wrapEntity(job, {
        ...job,
        name: payload?.jobName || job.name,
        state: payload?.state || job.state,
      });
      this.jobService.update(wrappedJob);
    }
    return updatedContract.id;
  }
}
