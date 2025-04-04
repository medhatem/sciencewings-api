import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Job } from '@/modules/hr/models/Job';

@provideSingleton()
export class JobDAO extends BaseDao<Job> {
  private constructor(public model: Job) {
    super(model);
  }

  static getInstance(): JobDAO {
    return container.get(JobDAO);
  }
}
