import { IJobService, Job, JobDAO } from '..';
import { BaseService } from '@/modules/base/services/BaseService';
export declare class JobService extends BaseService<Job> implements IJobService {
    dao: JobDAO;
    constructor(dao: JobDAO);
    static getInstance(): IJobService;
}
