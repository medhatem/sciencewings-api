import { Project } from '@/modules/projects/models/Project';
import { container, provideSingleton } from '@/di/index';
import { Response } from 'typescript-rest-swagger';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { ContextRequest, GET, Path, PathParam, POST, PreProcessor, PUT, Security } from 'typescript-rest';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { CreateProjectDTO, GETProjectDTO, ProjectGetDTO, UpdateProjectDTO } from '@/modules/projects/dtos/projectDTO';
import { ProjectMemberRo, ProjectRO } from '@/modules/projects/routes/RequestObject';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { IProjectService } from '@/modules/projects/interfaces/IProjectInterfaces';
import { validateKeyclockUser } from '@/authenticators/validateKeyclockUser';
import { UserRequest } from '@/types/UserRequest';
import { IProjectMemberService } from '@/modules/projects/interfaces/IProjectMemberInterfaces';
import { ProjectMembersCreateDTO } from '@/modules/projects/dtos/projectMemberDTO';

@provideSingleton()
@Path('projects')
export class ProjectRoutes extends BaseRoutes<Project> {
  constructor(private projectService: IProjectService, private projectMemberService: IProjectMemberService) {
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

    return new ProjectGetDTO({ body: { data: [...(result || [])], statusCode: 200 } });
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
  @LoggerStorage()
  @PreProcessor(validateKeyclockUser)
  public async createProject(@ContextRequest request: UserRequest, payload: ProjectRO): Promise<CreateProjectDTO> {
    const result = await this.projectService.createProject(request, payload);

    return new CreateProjectDTO({ body: { id: result, statusCode: 201 } });
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

    return new UpdateProjectDTO({ body: { projectId: result, statusCode: 204 } });
  }
  /**
   * Containing data related to the participants of project to be saved in the database
   *
   * @param payload containing data related to the project to be saved in the database
   * @param id containing id of the project want to add members too
   * Should container Project data
   */

  @POST
  @Path('/:id/projectMembers/create')
  @Security()
  @LoggerStorage()
  @Response<ProjectMembersCreateDTO>(201, 'Project created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async createProjectMembers(
    payload: ProjectMemberRo[],
    @PathParam('id') id: number,
  ): Promise<ProjectMembersCreateDTO> {
    const result = await this.projectMemberService.createProjectMembers(payload, id);

    return new ProjectMembersCreateDTO({ body: { data: [...(result || [])], statusCode: 200 } });
  }
}
