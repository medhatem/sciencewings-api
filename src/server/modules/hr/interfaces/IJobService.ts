import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { JobRO } from '@/modules/hr/routes/RequestObject';
import { Result } from '@/utils/Result';

export abstract class IJobService extends IBaseService<any> {
  createJob: (payload: JobRO) => Promise<Result<number>>;
  updateJob: (payload: JobRO, jobId: number) => Promise<Result<number>>;
}
