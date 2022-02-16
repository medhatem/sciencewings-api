import { Collection } from '@mikro-orm/core';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
import { Phone } from '@/modules/phones/models/Phone';
export declare class User extends BaseModel<User> {
    constructor();
    static getInstance(): User;
    firstname: string;
    lastname: string;
    email: string;
    address?: string;
    phone?: Collection<Phone, unknown>;
    dateofbirth: Date;
    keycloakId: string;
    organizations: Collection<Organization, unknown>;
    signature?: string;
    actionId?: number;
    share?: boolean;
}
