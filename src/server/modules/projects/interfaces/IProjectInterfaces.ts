import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Project } from '@/modules/projects/models/Project';
import {
  ProjectMemberRo,
  ProjectRO,
  UpdateProjectParticipantRO,
  UpdateProjectRO,
} from '@/modules/projects/routes/RequestObject';
import { ProjectMember } from '@/modules/projects/models/ProjectMember';
import { ProjectsPaginatedList } from '@/types/types';

export abstract class IProjectService extends IBaseService<any> {
  createProject: (userId: number, payload: ProjectRO) => Promise<number>;
  updateProject: (payload: UpdateProjectRO, projetcId: number) => Promise<number>;
  getOrganizationProjects: (id: number, page?: number, limit?: number) => Promise<Project[]>;
  getOrganizationProjectById: (id: number) => Promise<Project>;
  addMembersToProject: (payload: ProjectMemberRo, id: number) => Promise<ProjectMember[]>;
  getALLProjectParticipants: (id: number, page?: number, limit?: number) => Promise<ProjectMember[]>;
  updateProjectParticipant: (projectId: number, payload: UpdateProjectParticipantRO) => Promise<ProjectMember>;
  getAllOrganizationProjectsList: (id: number, page?: number, size?: number) => Promise<ProjectsPaginatedList>;
}
