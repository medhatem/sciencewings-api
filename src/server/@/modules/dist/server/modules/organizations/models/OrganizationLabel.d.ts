import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
export declare class OrganizationLabel extends BaseModel<OrganizationLabel> {
    constructor();
    static getInstance(): OrganizationLabel;
    name: string;
    organization: Organization;
}
