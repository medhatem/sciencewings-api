import { IGroupService } from '@/modules/hr/interfaces/IGroupService';
import { IJobService } from '@/modules/hr/interfaces/IJobService';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { Contract } from '@/modules/hr/models/Contract';
import { ContractDao } from '@/modules/hr/daos/ContractDao';
import { ContractRO } from '@/modules/hr/routes/RequestObject';
import { IContractService } from '@/modules/hr/interfaces/IContractService';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { ICalendarService } from '@/modules/reservation/interfaces/ICalendarService';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { log } from '@/decorators/log';
import { validate } from '@/decorators/validate';
import { validateParam } from '@/decorators/validateParam';
import { CreateContractSchema, UpdateContractSchema } from '@/modules/hr/schemas/ContractSchema';
import { NotFoundError } from '@/Exceptions/NotFoundError';

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
   * check the existence of optional properties for a given contract
   * @param payload
   * @returns Optional Properties
   */
  @log()
  private async checkForOptionalPropertiesInContract(payload: ContractRO): Promise<any> {
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
  public async createContract(@validateParam(CreateContractSchema) payload: ContractRO): Promise<number> {
    const organization = await this.origaniaztionService.get(payload.organization);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_{{org}}', {
        variables: { org: `${payload.organization}` },
        isOperational: true,
      });
    }

    const entities = await this.checkForOptionalPropertiesInContract(payload);

    const contract = {
      ...payload,
      organization,
      ...entities,
    };

    const createdContract = await this.create(contract);
    return createdContract.id;
  }

  /**
   * Override the update method
   */
  @log()
  @validate
  public async updateContract(@validateParam(UpdateContractSchema) payload: ContractRO, id: number): Promise<number> {
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
