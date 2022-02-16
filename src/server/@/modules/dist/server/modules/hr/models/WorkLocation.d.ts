import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
import { ResPartner } from '@/modules/organizations/models/ResPartner';
export declare class WorkLocation extends BaseModel<WorkLocation> {
    constructor();
    static getInstance(): WorkLocation;
    id: number;
    active?: boolean;
    name: string;
    organization: Organization;
    address: ResPartner;
    locationNumber?: string;
}
