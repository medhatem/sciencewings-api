import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { JobRO } from '@/modules/hr/routes/RequestObject';

export abstract class IJobService extends IBaseService<any> {
  createJob: (payload: JobRO) => Promise<void>;
  updateJob: (payload: JobRO, jobId: number) => Promise<number>;
}
