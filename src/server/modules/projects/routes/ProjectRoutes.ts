import { Project } from '@/modules/projects/models/Project';
import { container, provideSingleton } from '@/di/index';
import { Response } from 'typescript-rest-swagger';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Path, PathParam, POST, PUT, Security } from 'typescript-rest';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import {
  CreateProjectDTO,
  ProjectBaseBodyGetDTO,
  ProjectDTO,
  UpdateProjectDTO,
} from '@/modules/projects/dtos/projectDTO';
import { ProjectRO } from './RequestObject';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { IProjectService } from '@/modules/projects/interfaces/IProjectInterfaces';

@provideSingleton()
@Path('projects')
export class ProjectRoutes extends BaseRoutes<Project> {
  constructor(private projectService: IProjectService) {
    super(projectService as any, new CreateProjectDTO(), new UpdateProjectDTO());
  }

  static getInstance(): ProjectRoutes {
    return container.get(ProjectRoutes);
  }

  /**
   * Containing data related to the project to be saved in the database
   *
   * @param payload
   * Should container Project data
   */
  @POST
  @Path('create')
  @Security()
  @LoggerStorage()
  @Response<ProjectDTO>(201, 'Project created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async createProject(payload: ProjectRO): Promise<ProjectDTO> {
    const result = await this.projectService.createProject(payload);

    if (result.isFailure) {
      throw result.error;
    }

    return new ProjectDTO({ body: { projectId: result.getValue(), statusCode: 201 } });
  }

  /**
   * Update a project record in the database
   *
   * @param payload
   * @param project id
   */
  @PUT
  @Path('/update/:id')
  @Security()
  @LoggerStorage()
  @Response<ProjectBaseBodyGetDTO>(204, 'Project updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateProject(payload: ProjectRO, @PathParam('id') id: number): Promise<ProjectDTO> {
    const result = await this.projectService.updateProject(payload, id);

    if (result.isFailure) {
      throw result.error;
    }

    return new ProjectDTO({ body: { projectId: result.getValue(), statusCode: 204 } });
  }
}
