import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Job } from '..';
export declare class JobDAO extends BaseDao<Job> {
    model: Job;
    private constructor();
    static getInstance(): JobDAO;
}
