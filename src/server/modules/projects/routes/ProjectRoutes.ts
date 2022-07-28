import { Project } from '@/modules/projects/models/Project';
import { container, provideSingleton } from '@/di/index';
import { Response } from 'typescript-rest-swagger';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { ContextRequest, GET, Path, PathParam, POST, PUT, Security } from 'typescript-rest';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { CreateProjectDTO, GETProjectDTO, ProjectGetDTO, UpdateProjectDTO } from '@/modules/projects/dtos/projectDTO';
import { listMembersRo, ProjectRO, UpdateProjectParticipantRO } from '@/modules/projects/routes/RequestObject';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { IProjectService } from '@/modules/projects/interfaces/IProjectInterfaces';
import { UserRequest } from '@/types/UserRequest';
import {
  ProjectMemberRequestDTO,
  ProjectMembersCreateDTO,
  UpdateProjectMemberDTO,
} from '@/modules/projects/dtos/projectMemberDTO';

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
  public async createProject(@ContextRequest request: UserRequest, payload: ProjectRO): Promise<CreateProjectDTO> {
    const result = await this.projectService.createProject(request.userId, payload);
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
  @Response<ProjectMembersCreateDTO>(201, 'Project member created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async addMembersToProject(
    payload: listMembersRo,
    @PathParam('id') id: number,
  ): Promise<ProjectMembersCreateDTO> {
    const result = await this.projectService.addMembersToProject(payload, id);

    return new ProjectMembersCreateDTO({ body: { data: [...(result || [])], statusCode: 200 } });
  }

  /**
   * retrive participant which works on project
   *
   * @param id: project id
   */
  @GET
  @Path('getParticipant/:id')
  @Security()
  @LoggerStorage()
  @Response<ProjectMemberRequestDTO>(200, 'Return organization members Successfully')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getALLProjectParticipants(@PathParam('id') id: number): Promise<ProjectMemberRequestDTO> {
    const result = await this.projectService.getALLProjectParticipants(id);

    return new ProjectMemberRequestDTO({ body: { data: result, statusCode: 200 } });
  }

  /**
   * Update a project participant in the database
   *
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
}
