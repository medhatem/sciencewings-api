import { JobRO } from './../routes/RequestObject';
import { Result } from '@utils/Result';
import { IBaseService } from '../../base/interfaces/IBaseService';

export abstract class IJobService extends IBaseService<any> {
  createJob: (payload: JobRO) => Promise<Result<number>>;
  updateJob: (payload: JobRO, jobId: number) => Promise<Result<number>>;
}
