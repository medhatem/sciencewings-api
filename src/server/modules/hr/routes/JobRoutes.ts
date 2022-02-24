import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { Job } from '../../hr/models/Job';
import { Path, PathParam, POST, PUT, Security } from 'typescript-rest';
import { JobDTO, CreateJobDTO, UpdateJobDTO } from '../dtos/JobDTO';
import { KEYCLOAK_TOKEN } from '../../../authenticators/constants';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { JobRO } from './RequestObject';
import { IJobService } from '../../hr/interfaces';
import { Response } from 'typescript-rest-swagger';

@provideSingleton()
@Path('jobs')
export class JobRoutes extends BaseRoutes<Job> {
  constructor(private jobService: IJobService) {
    super(jobService as any, new CreateJobDTO(), new UpdateJobDTO());
  }

  static getInstance(): JobRoutes {
    return container.get(JobRoutes);
  }

  @POST
  @Path('create')
  //   @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  @Response<JobRO>(201, 'Job created Successfully')
  @Response<JobRO>(500, 'Internal Server Error')
  public async createJob(payload: JobRO): Promise<JobDTO> {
    const result = await this.jobService.createJob(payload);

    if (result.isFailure) {
      return new JobDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new JobDTO().serialize({ body: { jobId: result.getValue(), statusCode: 201 } });
  }

  @PUT
  @Path('/update/:id')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  @Response<JobDTO>(204, 'Job updated Successfully')
  @Response<JobDTO>(500, 'Internal Server Error')
  public async createUpdateJob(payload: JobRO, @PathParam('id') id: number): Promise<JobDTO> {
    const result = await this.jobService.updateJob(payload, id);

    if (result.isFailure) {
      return new JobDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new JobDTO().serialize({ body: { jobId: result.getValue(), statusCode: 204 } });
  }
}
