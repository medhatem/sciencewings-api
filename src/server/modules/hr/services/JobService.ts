import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import { IJobService } from '@/modules/hr/interfaces/IJobService';
import { Job } from '@/modules/hr/models/Job';
import { JobDAO } from '@/modules/hr/daos/JobDAO';

@provideSingleton(IJobService)
export class JobService extends BaseService<Job> implements IJobService {
  constructor(public dao: JobDAO) {
    super(dao);
  }

  static getInstance(): IJobService {
    return container.get(IJobService);
  }
}
