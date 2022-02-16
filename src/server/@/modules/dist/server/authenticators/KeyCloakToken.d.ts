import * as express from 'express';
import { ServiceAuthenticator } from 'typescript-rest';
import { UserExctractionAndValidation } from './userExctractionAndValidation';
export declare class KeyCloakToken implements ServiceAuthenticator {
    private userExtractorAndValidator;
    constructor(userExtractorAndValidator: UserExctractionAndValidation);
    getMiddleware(): any;
    getRoles(): any[];
    initialize(router: express.Router): void;
}
