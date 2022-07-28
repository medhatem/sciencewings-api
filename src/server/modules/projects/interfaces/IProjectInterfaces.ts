import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Project } from '@/modules/projects/models/Project';
import {
  listMembersRo,
  ProjectRO,
  UpdateProjectParticipantRO,
  UpdateProjectRO,
} from '@/modules/projects/routes/RequestObject';
import { ProjectMember } from '@/modules/projects/models/ProjectMember';

export abstract class IProjectService extends IBaseService<any> {
  createProject: (userId: number, payload: ProjectRO) => Promise<number>;
  updateProject: (payload: UpdateProjectRO, projetcId: number) => Promise<number>;
  getOrganizationProjects: (id: number) => Promise<Project[]>;
  addMembersToProject: (payload: listMembersRo, id: number) => Promise<ProjectMember[]>;
  getALLProjectParticipants: (id: number) => Promise<ProjectMember[]>;
  updateProjectParticipant: (projectId: number, payload: UpdateProjectParticipantRO) => Promise<ProjectMember>;
}
