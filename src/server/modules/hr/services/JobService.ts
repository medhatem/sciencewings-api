import { Job } from '@/modules/hr/models/Job';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { JobRO } from '@/modules/hr/routes/RequestObject';
import { BaseService } from '@/modules/base/services/BaseService';
import { provideSingleton, container } from '@/di/index';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';
import { log } from '@/decorators/log';
import { JobSchema } from '@/modules/hr/schemas/JobSchema';
import { IJobService } from '@/modules/hr/interfaces/IJobService';
import { JobDAO } from '@/modules/hr/daos/JobDAO';
import { NotFoundError } from '@/Exceptions';

@provideSingleton(IJobService)
export class JobService extends BaseService<Job> implements IJobService {
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
  public async createJob(@validateParam(JobSchema) payload: JobRO): Promise<void> {
    let organization;
    if (payload.organization) {
      const fetchedOrganization = await this.getOrganization(payload.organization);
      organization = fetchedOrganization.getValue();
    }

    await this.create(
      this.wrapEntity(this.dao.model, {
        ...payload,
        organization,
      }),
    );
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
