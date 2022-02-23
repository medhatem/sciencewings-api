import { IBaseService } from '../../base/interfaces/IBaseService';
import { Result } from '@utils/Result';
import { ProjectRO } from '../routes/RequestObject';

export abstract class IProjectService extends IBaseService<any> {
  createProject: (payload: ProjectRO) => Promise<Result<number>>;
  updateProject: (payload: ProjectRO, memberId: number) => Promise<Result<number>>;
}
