import { IJobService, Job, JobDAO } from '..';
import { container, provideSingleton } from '@di/index';

import { BaseService } from '@/modules/base/services/BaseService';

@provideSingleton(IJobService)
export class JobService extends BaseService<Job> implements IJobService {
  constructor(public dao: JobDAO) {
    super(dao);
  }

  static getInstance(): IJobService {
    return container.get(IJobService);
  }
}
