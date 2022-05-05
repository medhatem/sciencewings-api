import { Job } from '@/modules/hr/models/Job';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { JobRO } from '@/modules/hr/routes/RequestObject';
import { BaseService } from '@/modules/base/services/BaseService';
import { provideSingleton, container } from '@/di/index';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';
import { safeGuard } from '@/decorators/safeGuard';
import { log } from '@/decorators/log';
import { Result } from '@/utils/Result';
import { JobSchema } from '@/modules/hr/schemas/JobSchema';
import { IJobService } from '@/modules/hr/interfaces/IJobService';
import { JobDAO } from '@/modules/hr/daos/JobDAO';

@provideSingleton(IJobService)
export class JobService extends BaseService<Job> implements IJobService {
  constructor(public dao: JobDAO, public organizationService: IOrganizationService) {
    super(dao);
  }

  static getInstance(): IJobService {
    return container.get(IJobService);
  }

  private async getOrganization(organizationId: number): Promise<Result<any>> {
    const fetchedOrganization = await this.organizationService.get(organizationId);
    if (fetchedOrganization.isFailure || fetchedOrganization.getValue() === null) {
      return Result.notFound(`Organization with id ${organizationId} does not exist`);
    }
    return Result.ok(fetchedOrganization.getValue());
  }

  /**
   * create a new job
   * @param payload job data
   * @returns the created job id
   */
  @log()
  @safeGuard()
  @validate
  public async createJob(@validateParam(JobSchema) payload: JobRO): Promise<Result<number>> {
    let organization;
    if (payload.organization) {
      const fetchedOrganization = await this.getOrganization(payload.organization);
      if (fetchedOrganization.isFailure) {
        return fetchedOrganization;
      }
      organization = fetchedOrganization.getValue();
    }

    const createdJob = await this.create(
      this.wrapEntity(this.dao.model, {
        ...payload,
        organization,
      }),
    );

    if (createdJob.isFailure) {
      return createdJob;
    }
    return Result.ok(createdJob.getValue().id);
  }

  /**
   * update an existing job data given its id
   * @param payload the new job data
   * @param jobId
   * @returns the updated job id
   */
  @log()
  @safeGuard()
  public async updateJob(payload: JobRO, jobId: number): Promise<Result<number>> {
    const fetchedJob = await this.dao.get(jobId);
    if (!fetchedJob) {
      return Result.notFound(`Job with id ${jobId} does not exist`);
    }

    if (payload.organization) {
      const fetchedOrganization = await this.getOrganization(payload.organization);
      if (fetchedOrganization.isFailure) {
        return fetchedOrganization;
      }
      fetchedJob.organization = fetchedOrganization.getValue();
    }

    const updatedJob = await this.update(
      this.wrapEntity(fetchedJob, {
        ...fetchedJob,
        ...payload,
      }),
    );

    if (updatedJob.isFailure) {
      return updatedJob;
    }
    return Result.ok(updatedJob.getValue().id);
  }
}
