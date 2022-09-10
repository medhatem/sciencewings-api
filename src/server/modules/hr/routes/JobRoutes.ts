import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Job } from '@/modules/hr/models/Job';
import { Path, PathParam, POST, PUT, Security } from 'typescript-rest';
import { JobDTO, CreateJobDTO, UpdateJobDTO, JobBaseBodyGetDTO } from '@/modules/hr/dtos/JobDTO';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { JobRO } from './RequestObject';
import { IJobService } from '@/modules/hr/interfaces/IJobService';
import { Response } from 'typescript-rest-swagger';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';

@provideSingleton()
@Path('jobs')
export class JobRoutes extends BaseRoutes<Job> {
  constructor(private jobService: IJobService) {
    super(jobService as any, new CreateJobDTO(), new UpdateJobDTO());
  }

  static getInstance(): JobRoutes {
    return container.get(JobRoutes);
  }

  /**
   * create a job that the organization offer
   * @param payload
   * @returns the created job id
   */
  @POST
  @Path('create')
  @Security()
  @LoggerStorage()
  @Response<JobBaseBodyGetDTO>(201, 'Job created Successfully')
  @Response<JobRO>(500, 'Internal Server Error')
  public async createJob(payload: JobRO): Promise<CreateJobDTO> {
    const result = await this.jobService.createJob(payload);

    return new CreateJobDTO({ body: { id: result, statusCode: 201 } });
  }

  /**
   * update a job data given its id
   * @param payload
   * @param id
   * @returns the updated job id
   */
  @PUT
  @Path('/update/:id')
  @Security()
  @LoggerStorage()
  @Response<JobDTO>(204, 'Job updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateJob(payload: JobRO, @PathParam('id') id: number): Promise<CreateJobDTO> {
    const result = await this.jobService.updateJob(payload, id);

    return new UpdateJobDTO({ body: { id: result, statusCode: 204 } });
  }
}
