import { Project } from '@/modules/projects/models/Project';
import { container, provideSingleton } from '@/di/index';
import { Response } from 'typescript-rest-swagger';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { GET, Path, PathParam, POST, PUT, Security } from 'typescript-rest';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { CreateProjectDTO, GETProjectDTO, ProjectGetDTO, UpdateProjectDTO } from '@/modules/projects/dtos/projectDTO';
import { ProjectRO } from '@/modules/projects/routes/RequestObject';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { IProjectService } from '@/modules/projects/interfaces/IProjectInterfaces';

@provideSingleton()
@Path('projects')
export class ProjectRoutes extends BaseRoutes<Project> {
  constructor(private projectService: IProjectService) {
    super(projectService as any, new GETProjectDTO(), new UpdateProjectDTO());
  }

  static getInstance(): ProjectRoutes {
    return container.get(ProjectRoutes);
  }
  /**
   * Retrieve organization projects
   *
   * @param id of organization
   */
  @GET
  @Path('getOrganizationProjects/:id')
  @Security()
  @LoggerStorage()
  @Response<ProjectGetDTO>(200, 'Projects extract Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getOrganizationProjects(@PathParam('id') id: number): Promise<ProjectGetDTO> {
    const result = await this.projectService.getOrganizationProjects(id);

    if (result.isFailure || !result.getValue) {
      throw result.error;
    }

    return new ProjectGetDTO({ body: { data: [...(result.getValue() || [])], statusCode: 200 } });
  }
  /**
   * Containing data related to the project to be saved in the database
   *
   * @param payload containing data related to the project to be saved in the database
   * Should container Project data
   */
  @POST
  @Path('create')
  @Security()
  @LoggerStorage()
  @Response<CreateProjectDTO>(201, 'Project created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async createProject(payload: ProjectRO): Promise<CreateProjectDTO> {
    const result = await this.projectService.createProject(payload);

    if (result.isFailure) {
      throw result.error;
    }

    return new CreateProjectDTO({ body: { id: result.getValue(), statusCode: 201 } });
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
  @Response<UpdateProjectDTO>(204, 'Project updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateProject(payload: ProjectRO, @PathParam('id') id: number): Promise<UpdateProjectDTO> {
    const result = await this.projectService.updateProject(payload, id);

    if (result.isFailure) {
      throw result.error;
    }

    return new UpdateProjectDTO({ body: { projectId: result.getValue(), statusCode: 204 } });
  }
}
