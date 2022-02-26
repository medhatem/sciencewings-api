import { Job } from '@/modules/hr/models/Job';
import { IOrganizationService } from '@/modules/organizations/interfaces';
import { JobRO } from '@/modules/hr/routes/RequestObject';
import { BaseService } from '@/modules/base/services/BaseService';
import { provideSingleton, container } from '@/di/index';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';
import { safeGuard } from '@/decorators/safeGuard';
import { log } from '@/decorators/log';
import { Result } from './../../../utils/Result';
import { JobSchema } from '@/modules/hr/schemas/JobSchema';
import { IJobService } from '@/modules/hr/interfaces/IJobService';
import { JobDAO } from '@/modules/hr/daos/JobDAO';
import { IGroupService } from '@/modules/hr/interfaces/IGroupService';

@provideSingleton(IJobService)
export class JobService extends BaseService<Job> implements IJobService {
  constructor(
    public dao: JobDAO,
    public groupService: IGroupService,
    public organizationService: IOrganizationService,
  ) {
    super(dao);
  }

  static getInstance(): IJobService {
    return container.get(IJobService);
  }

  @log()
  @safeGuard()
  @validate
  public async createJob(@validateParam(JobSchema) payload: JobRO): Promise<Result<number>> {
    let fetchedGroup;
    if (payload.group) {
      fetchedGroup = await this.groupService.get(payload.group);
      if (fetchedGroup.isFailure || fetchedGroup.getValue() === null) {
        return Result.fail(`Group with id ${payload.group} does not exist`);
      }
      fetchedGroup = await fetchedGroup.getValue();
    }

    let fetchedOrganization;
    if (payload.organization) {
      fetchedOrganization = await this.organizationService.get(payload.organization);
      if (fetchedOrganization.isFailure || fetchedOrganization.getValue() === null) {
        return Result.fail(`Organization with id ${payload.organization} does not exist`);
      }
      fetchedOrganization = await fetchedOrganization.getValue();
    }

    const createdJob = await this.create({
      id: null,
      ...payload,
      group: fetchedGroup,
      organization: fetchedOrganization,
    });

    if (createdJob.isFailure) {
      return Result.fail<number>(createdJob.error);
    }
    return Result.ok(createdJob.getValue().id);
  }

  @log()
  @safeGuard()
  public async updateJob(payload: JobRO, jobId: number): Promise<Result<number>> {
    const fetchedJob = await this.dao.get(jobId);
    if (!fetchedJob) {
      return Result.fail(`Job with id ${jobId} does not exist`);
    }

    let fetchedGroup;
    if (payload.group) {
      fetchedGroup = await this.groupService.get(payload.group);
      if (fetchedGroup.isFailure || fetchedGroup.getValue() === null) {
        return Result.fail(`Group with id ${payload.group} does not exist`);
      }
      fetchedJob.group = await fetchedGroup.getValue();
    }

    let fetchedOrganization;
    if (payload.organization) {
      fetchedOrganization = await this.organizationService.get(payload.organization);
      if (fetchedOrganization.isFailure || fetchedOrganization.getValue() === null) {
        return Result.fail(`Organization with id ${payload.organization} does not exist`);
      }
      fetchedJob.organization = await fetchedOrganization.getValue();
    }

    const updatedJob = await this.update(
      this.wrapEntity(fetchedJob, {
        ...fetchedJob,
        ...payload,
      }),
    );

    if (updatedJob.isFailure) {
      return Result.fail<number>(updatedJob.error);
    }
    return Result.ok((await updatedJob.getValue()).id);
  }
}
