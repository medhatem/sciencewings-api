import { Project } from './../models/Project';
import { container, provideSingleton } from '@/di/index';
import { Response } from 'typescript-rest-swagger';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Path, PathParam, POST, PUT, Security } from 'typescript-rest';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { CreateProjectDTO, IProjectService, ProjectDTO, UpdateProjectDTO } from '..';
import { ProjectRO } from './RequestObject';
import { KEYCLOAK_TOKEN } from '../../../authenticators/constants';

@provideSingleton()
@Path('projects')
export class ProjectRoutes extends BaseRoutes<Project> {
  constructor(private projectService: IProjectService) {
    super(projectService as any, new CreateProjectDTO(), new UpdateProjectDTO());
  }

  static getInstance(): ProjectRoutes {
    return container.get(ProjectRoutes);
  }

  @POST
  @Path('create')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  @Response<ProjectDTO>(201, 'Project created Successfully')
  @Response<ProjectDTO>(500, 'Internal Server Error')
  public async createProject(payload: ProjectRO): Promise<ProjectDTO> {
    const result = await this.projectService.createProject(payload);

    if (result.isFailure) {
      return new ProjectDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new ProjectDTO().serialize({ body: { projectId: result.getValue(), statusCode: 201 } });
  }

  @PUT
  @Path('/update/:id')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  @Response<ProjectDTO>(204, 'Project updated Successfully')
  @Response<ProjectDTO>(500, 'Internal Server Error')
  public async createUpdateProject(payload: ProjectRO, @PathParam('id') id: number): Promise<ProjectDTO> {
    const result = await this.projectService.updateProject(payload, id);

    if (result.isFailure) {
      return new ProjectDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new ProjectDTO().serialize({ body: { projectId: result.getValue(), statusCode: 204 } });
  }
}
