import { AddressOrganizationDTO } from '@/modules/address/dtos/AddressDTO';
import { PhoneDTO } from '@/modules/phones/dtos/PhoneDTO';
export declare class CreateOrganizationRO {
    name: string;
    email: string;
    phones: PhoneDTO[];
    type: string;
    address: AddressOrganizationDTO[];
    labels: string[];
    members: number[];
    direction: number;
    social_facebook?: string;
    social_twitter?: string;
    social_github?: string;
    social_linkedin?: string;
    social_youtube?: string;
    social_instagram?: string;
    adminContact: number;
    parentId?: string;
}
export declare class UserInviteToOrgRO {
    organizationId: number;
    email: string;
}
