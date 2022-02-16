import { AddressType } from '@/modules/address/models/AdressModel';
export declare class AddressOrganizationDTO {
    country: string;
    province: string;
    code: string;
    type: AddressType;
    city: string;
    street: string;
    appartement: number;
}
