import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
import { User } from '@/modules/users/models/User';
export declare class Phone extends BaseModel<Phone> {
    constructor();
    static getInstance(): Phone;
    label: string;
    code: string;
    number: number;
    user?: User;
    organization?: Organization;
}
