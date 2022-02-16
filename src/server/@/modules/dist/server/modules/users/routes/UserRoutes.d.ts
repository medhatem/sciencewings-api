import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { User } from '../models/User';
import { UserRequest } from '@/modules/../types/UserRequest';
import { RegisterUserFromTokenDTO, ResetPasswordDTO } from '@/modules/users/dtos/RegisterUserFromTokenDTO';
import { UserDTO } from '@/modules/users/dtos/UserDTO';
import { ResetPasswordRO, UserDetailsRO } from './RequstObjects';
import { CreatedUserDTO } from '@/modules/users/dtos/CreatedUserDTO';
import { IUserService } from '../interfaces/IUserService';
export declare class UserRoutes extends BaseRoutes<User> {
    private userService;
    constructor(userService: IUserService);
    static getInstance(): UserRoutes;
    /**
     * Registers a new user in the database
     * this route is called after signup
     * since keycloak takes care of creating the user
     * we parse the user data from the keycloak token
     * and save it to the database
     *
     * @param request
     */
    registerUserFromToken(request: UserRequest): Promise<RegisterUserFromTokenDTO>;
    /**
     *  Method that resets a user password in keycloak
     *
     * @param payload
     */
    resetPassword(payload: ResetPasswordRO): Promise<ResetPasswordDTO>;
    /**
     * Update user details
     * Must be authentificated
     * @param payload: User object
     */
    updateUserDetails(payload: UserDetailsRO, request: UserRequest): Promise<CreatedUserDTO>;
    /**
     * Get user By auth token
     */
    getUserByKeycloakId(keycloakId: string): Promise<UserDTO>;
}
