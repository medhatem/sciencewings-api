import { Collection } from '@mikro-orm/core';
import { Address } from '@/modules/address/models/AdressModel';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { OrganizationLabel } from '@/modules/organizations/models/OrganizationLabel';
import { Phone } from '@/modules/phones/models/Phone';
import { User } from '@/modules/users/models/User';
export declare enum OrganizationType {
    PUBLIC = "Public",
    SERVICE = "Service",
    INSTITUT = "Institut"
}
export declare class Organization extends BaseModel<Organization> {
    constructor();
    static getInstance(): Organization;
    name: string;
    email: string;
    phone: Phone;
    type: OrganizationType;
    address: Collection<Address, unknown>;
    labels?: Collection<OrganizationLabel, unknown>;
    members?: Collection<User, unknown>;
    socialFacebook?: string;
    socialTwitter?: string;
    socialGithub?: string;
    socialLinkedin?: string;
    socialYoutube?: string;
    socialInstagram?: string;
    direction: User;
    admin_contact: User;
    parent?: Organization;
    children?: Collection<Organization, unknown>;
}
