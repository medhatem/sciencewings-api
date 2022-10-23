import { Project } from '@/modules/projects/models/Project';
import { container, provideSingleton } from '@/di/index';
import { Response } from 'typescript-rest-swagger';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { ContextRequest, GET, Path, PathParam, POST, PUT, QueryParam, Security } from 'typescript-rest';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { CreateProjectDTO, GETProjectDTO, ProjectGetDTO, UpdateProjectDTO } from '@/modules/projects/dtos/projectDTO';
import {
  ProjectMemberRo,
  ProjectRO,
  UpdateProjectParticipantRO,
  UpdateProjectRO,
} from '@/modules/projects/routes/RequestObject';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { IProjectService } from '@/modules/projects/interfaces/IProjectInterfaces';
import { UserRequest } from '@/types/UserRequest';
import {
  CreateProjectMemberDTO,
  ProjectMemberRequestDTO,
  UpdateProjectMemberDTO,
} from '@/modules/projects/dtos/projectMemberDTO';
import { ProjectListRequestDTO } from '@/modules/projects/dtos/projectListDto';

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
   * @param id of organization
   */
  @GET
  @Path('getOrganizationProjects/:id')
  @Security()
  @LoggerStorage()
  @Response<ProjectGetDTO>(200, 'Projects extract Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getOrganizationProjects(
    @PathParam('id') id: number,
    @QueryParam('page') page?: number,
    @QueryParam('limit') limit?: number,
  ): Promise<ProjectGetDTO> {
    const result = await this.projectService.getOrganizationProjects(id, page || null, limit || null);

    return new ProjectGetDTO({ body: { data: [...(result || [])], statusCode: 200 } });
  }
  /**
   * Retrieve organization project by id
   * @param id of project
   */
  @GET
  @Path('getOrganizationProjectById/:id')
  @Security()
  @LoggerStorage()
  @Response<GETProjectDTO>(200, 'Project extract Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getOrganizationProjectById(@PathParam('id') id: number): Promise<GETProjectDTO> {
    const result = await this.projectService.getOrganizationProjectById(id);

    return new GETProjectDTO({ body: { ...result, statusCode: 200 } });
  }

  /**
   * Containing data related to the project to be saved in the database
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
  public async createProject(@ContextRequest request: UserRequest, payload: ProjectRO): Promise<CreateProjectDTO> {
    const result = await this.projectService.createProject(request.userId, payload);
    return new CreateProjectDTO({ body: { id: result, statusCode: 201 } });
  }

  /**
   * Update a project in the database
   * @param payload
   * @param project id
   */
  @PUT
  @Path('/updateProject/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateProjectDTO>(204, 'Project updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateProject(payload: UpdateProjectRO, @PathParam('id') id: number): Promise<UpdateProjectDTO> {
    const result = await this.projectService.updateProject(payload, id);

    return new UpdateProjectDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * Containing data related to the participants of project to be saved in the database
   * @param payload containing array of data related to participants to be saved in the database
   * @param id containing id of the project want to add members too
   * Should container Project data
   */
  @POST
  @Path('/:id/projectMembers/create')
  @Security()
  @LoggerStorage()
  @Response<CreateProjectMemberDTO>(201, 'Project member created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async addMembersToProject(
    payload: ProjectMemberRo,
    @PathParam('id') id: number,
  ): Promise<CreateProjectMemberDTO> {
    const result = await this.projectService.addMembersToProject(payload, id);

    return new CreateProjectMemberDTO({ body: { ...result, statusCode: 200 } });
  }

  /**
   * retrive all participants working on project
   * @param id: project id
   */
  @GET
  @Path('getParticipant/:id')
  @Security()
  @LoggerStorage()
  @Response<ProjectMemberRequestDTO>(200, 'Return project participants Successfully')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getALLProjectParticipants(
    @PathParam('id') id: number,
    @QueryParam('page') page?: number,
    @QueryParam('limit') limit?: number,
  ): Promise<ProjectMemberRequestDTO> {
    const result = await this.projectService.getALLProjectParticipants(id, page || null, limit || null);

    return new ProjectMemberRequestDTO({ body: { data: result, statusCode: 200 } });
  }

  /**
   * Update a project participant role and status in the database
   * @param payload
   * @param projectId project id
   */
  @PUT
  @Path('update/projectParticipant/:projectId')
  @Security()
  @LoggerStorage()
  @Response<UpdateProjectMemberDTO>(204, 'Project pariticipant updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateRoleAndStatusOfProjectParticipant(
    @PathParam('projectId') projectId: number,
    payload: UpdateProjectParticipantRO,
  ): Promise<UpdateProjectMemberDTO> {
    const result = await this.projectService.updateProjectParticipant(projectId, payload);
    return new UpdateProjectMemberDTO({ body: { ...result, statusCode: 201 } });
  }
  /**
   * this route is for the project list in frontend, it combine between Project and projectMember model
   * and send only the necessary data to print
   * @param id: org id
   * @param page: queryParam to specify page the client want
   * @param size: queryParam to specify the size of one page
   */
  @GET
  @Path('getProjectList/:id')
  @Security()
  @LoggerStorage()
  @Response<ProjectListRequestDTO>(200, 'Return project list Successfully')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getAllOrganizationProjectsList(
    @PathParam('id') id: number,
    @QueryParam('page') page?: number,
    @QueryParam('size') size?: number,
  ): Promise<ProjectListRequestDTO> {
    const result = await this.projectService.getAllOrganizationProjectsList(id, page || null, size || null);

    if (result.pagination)
      return new ProjectListRequestDTO({
        body: { data: result.data, pagination: result.pagination, statusCode: 200 },
      });
    else
      return new ProjectListRequestDTO({
        body: { data: result, statusCode: 200 },
      });
  }
}
