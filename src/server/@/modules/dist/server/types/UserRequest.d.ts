import * as express from 'express';
export declare type KeycloakUserInfo = {
    email_verified: string;
    address: {
        [key: string]: any;
    };
    name: string;
    groups: string[];
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;
};
export declare type UserRequest = express.Request & {
    keycloakUser?: KeycloakUserInfo;
    userId?: number;
};
