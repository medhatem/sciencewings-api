import { Job } from '@/modules/hr/models/Job';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { JobRO } from '@/modules/hr/routes/RequestObject';
import { BaseService } from '@/modules/base/services/BaseService';
import { provideSingleton, container, lazyInject } from '@/di/index';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';
import { log } from '@/decorators/log';
import { JobSchema } from '@/modules/hr/schemas/JobSchema';
import { IJobService } from '@/modules/hr/interfaces/IJobService';
import { JobDAO } from '@/modules/hr/daos/JobDAO';
import { NotFoundError } from '@/Exceptions';
import { applyToAll } from '@/utils/utilities';
import { IContractService } from '../interfaces/IContractService';
import { Collection } from '@mikro-orm/core';
import { Contract } from '../models';
@provideSingleton(IJobService)
export class JobService extends BaseService<Job> implements IJobService {
  @lazyInject(IContractService) public contractService: IContractService;

  constructor(public dao: JobDAO, public organizationService: IOrganizationService) {
    super(dao);
  }

  static getInstance(): IJobService {
    return container.get(IJobService);
  }

  private async getOrganization(organizationId: number): Promise<any> {
    const fetchedOrganization = await this.organizationService.get(organizationId);
    if (fetchedOrganization === null) {
      throw new NotFoundError('ORG.NON_EXISTANT_{{org}}', {
        variables: { org: `${organizationId}` },
        isOperational: true,
      });
    }
    return fetchedOrganization;
  }

  /**
   * create a new job
   * @param payload job data
   * @returns the created job id
   */
  @log()
  @validate
  public async createJob(@validateParam(JobSchema) payload: JobRO): Promise<number> {
    let organization;
    if (payload.organization) {
      organization = await this.getOrganization(payload.organization);
    }
    const wrappedJob = this.wrapEntity(new Job(), {
      name: payload.name,
      description: payload.description || null,
      state: payload.state,
    });
    wrappedJob.organization = organization;
    let contracts: Collection<Contract>;
    if (payload.contracts) {
      await applyToAll(payload.contracts, async (contractId) => {
        const contract = await this.contractService.get(contractId);
        if (!contract) {
          throw new NotFoundError('CONTRACT.NON_EXISTANT {{contract}}', {
            variables: { contract: `${contractId}` },
            friendly: true,
          });
        }
        contracts.add(contract);
      });
    }
    wrappedJob.contracts = contracts;
    const job = await this.dao.create(wrappedJob);
    return job.id;
  }

  /**
   * update an existing job data given its id
   * @param payload the new job data
   * @param jobId
   * @returns the updated job id
   */
  @log()
  public async updateJob(payload: JobRO, jobId: number): Promise<number> {
    const fetchedJob = await this.dao.get(jobId);
    if (!fetchedJob) {
      throw new NotFoundError('JOB.NON_EXISTANT {{job}}', { variables: { job: `${jobId}` } });
    }

    if (payload.organization) {
      const organization = await this.getOrganization(payload.organization);
      fetchedJob.organization = organization;
    }

    const updatedJob = await this.update(
      this.wrapEntity(fetchedJob, {
        ...fetchedJob,
        ...payload,
      }),
    );

    return updatedJob.id;
  }
}
