import { ResetPasswordRO, UserDetailsRO } from '../routes/RequstObjects';
import { KeycloakUserInfo } from '@/modules/../types/UserRequest';
import { Result } from '@utils/Result';
import { User } from '@/modules/users/models';
export declare abstract class IUserService {
    static getInstance: () => IUserService;
    updateUserDetails: (payload: UserDetailsRO, userId: number) => Promise<Result<number>>;
    registerUser: (userInfo: KeycloakUserInfo) => Promise<Result<number>>;
    getUserByCriteria: (criteria: {
        [key: string]: any;
    }) => Promise<Result<User>>;
    resetPassword: (payload: ResetPasswordRO) => Promise<Result<string>>;
    create: (user: User) => Promise<Result<User>>;
    update: (user: User) => Promise<Result<User>>;
    getUserByKeycloakId: (payload: string) => Promise<Result<User>>;
}
