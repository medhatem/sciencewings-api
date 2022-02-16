import { BaseModel } from '@/modules//base/models/BaseModel';
import { Member } from './Member';
import { Organization } from '@/modules/organizations/models/Organization';
export declare class Group extends BaseModel<Group> {
    constructor();
    static getInstance(): Group;
    id: number;
    name: string;
    completeName?: string;
    active?: boolean;
    organization?: Organization;
    parent?: Group;
    manager?: Member;
    note?: string;
}
