import { Job } from './../models/Job';
import { IOrganizationService } from '@/modules/organizations/interfaces';
import { JobRO } from './../routes/RequestObject';
import { BaseService } from './../../base/services/BaseService';
import { provideSingleton, container } from '@/di/index';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';
import { safeGuard } from '@/decorators/safeGuard';
import { log } from '@/decorators/log';
import { Result } from './../../../utils/Result';
import { JobSchema } from '../schemas/JobSchema';
import { IJobService } from '../interfaces/IJobService';
import { JobDAO } from '../daos/JobDAO';
import { IGroupService } from '../interfaces/IGroupService';

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
  public async updateJob(payload: JobRO, memberId: number): Promise<Result<number>> {
    // ...

    // const updatedJob = await this.update(_member);
    // if (updatedJob.isFailure) {
    //   return Result.fail<number>(updatedJob.error);
    // }
    // return Result.ok(updatedJob.getValue().id);
    return Result.ok(0);
  }
}
