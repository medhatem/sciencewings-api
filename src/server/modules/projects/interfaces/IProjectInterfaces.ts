import { IBaseService } from '../../base/interfaces/IBaseService';
import { ProjectRO } from '../routes/RequestObject';
import { Result } from '@utils/Result';

export abstract class IProjectService extends IBaseService<any> {
  createProject: (payload: ProjectRO) => Promise<Result<number>>;
  updateProject: (payload: ProjectRO, projetcId: number) => Promise<Result<number>>;
}
