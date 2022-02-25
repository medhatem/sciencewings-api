import { container, provideSingleton } from '@/di/index';
import { BaseService } from '../../base/services/BaseService';
import { IJobService } from '../interfaces/IJobService';
import { Job } from '../models/Job';
import { JobDAO } from '../daos/JobDAO';

@provideSingleton(IJobService)
export class JobService extends BaseService<Job> implements IJobService {
  constructor(public dao: JobDAO) {
    super(dao);
  }

  static getInstance(): IJobService {
    return container.get(IJobService);
  }
}
