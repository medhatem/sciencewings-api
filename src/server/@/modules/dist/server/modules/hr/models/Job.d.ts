import { BaseModel } from '@/modules//base/models/BaseModel';
import { Group } from './Group';
import { Organization } from '@/modules//organizations/models/Organization';
export declare class Job extends BaseModel<Job> {
    constructor();
    static getInstance(): Job;
    id: number;
    name: string;
    description?: string;
    group?: Group;
    organization?: Organization;
    state: string;
}
