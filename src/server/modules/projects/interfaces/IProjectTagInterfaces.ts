import { ProjectTask } from './../models/ProjetcTask';
import { ProjectTag } from './../models/ProjetcTag';
import { IBaseService } from '../../base/interfaces/IBaseService';
import { Result } from '@utils/Result';
import { ProjectTagRO } from '../routes/RequestObject';

export abstract class IProjectTagService extends IBaseService<any> {
  getProjectTag: (projetcId: number) => Promise<Result<ProjectTag>>;
  getProjectTags: () => Promise<Result<ProjectTag[]>>;
  createProjectTags: (payload: ProjectTagRO[]) => Promise<Result<ProjectTask[]>>;
  updateProjectTag: (payload: ProjectTagRO, projetcTagId: number) => Promise<Result<number>>;
}
