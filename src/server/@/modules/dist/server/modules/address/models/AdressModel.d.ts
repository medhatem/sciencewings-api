import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
export declare enum AddressType {
    USER = "USER",
    ORGANIZATION = "ORGANIZATION"
}
export declare class Address extends BaseModel<Address> {
    static getInstance(): void;
    country: string;
    province: string;
    code: string;
    type: AddressType;
    city: string;
    street: string;
    appartement: string;
    organization: Organization;
}
