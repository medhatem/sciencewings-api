import { IUserService } from '../modules/users/interfaces/IUserService';
import { Result } from '@utils/Result';
import { UserRequest } from '../types/UserRequest';
export declare class UserExctractionAndValidation {
    private userService;
    constructor(userService: IUserService);
    /**
     *
     * Calls keycloak to validate whether the token is valid or not
     * if the token is not valid throw an Unauthorized error
     * if the token is valid add the keycloak user information into the request
     *
     * @param req express request
     */
    userExctractionAndValidation: (req: UserRequest) => Promise<Result<{
        keycloakUser: any;
        userId: any;
    }>>;
}
