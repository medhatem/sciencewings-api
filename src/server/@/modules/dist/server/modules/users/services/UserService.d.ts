import { ResetPasswordRO, UserDetailsRO } from '../routes/RequstObjects';
import { BaseService } from '@/modules/base/services/BaseService';
import { Email } from '@utils/Email';
import { IPhoneService } from '@/modules/phones/interfaces/IPhoneService';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { Keycloak } from '@sdks/keycloak';
import { KeycloakUserInfo } from '@/modules/../types/UserRequest';
import { Result } from '@utils/Result';
import { User } from '@/modules/users/models/User';
import { UserDao } from '../daos/UserDao';
export declare class UserService extends BaseService<User> implements IUserService {
    dao: UserDao;
    phoneSerice: IPhoneService;
    keycloak: Keycloak;
    emailService: Email;
    constructor(dao: UserDao, phoneSerice: IPhoneService, keycloak?: Keycloak, emailService?: Email);
    static getInstance(): IUserService;
    updateUserDetails(payload: UserDetailsRO, userId: number): Promise<Result<number>>;
    registerUser(userInfo: KeycloakUserInfo): Promise<Result<number>>;
    /**
     * fetches a user based on some search criteria
     *
     * @param criteria the search criteria
     */
    getUserByCriteria(criteria: {
        [key: string]: any;
    }): Promise<Result<User>>;
    /**
     * reset a user password
     *
     * @param payload
     */
    resetPassword(payload: ResetPasswordRO): Promise<Result<string>>;
    create(user: User): Promise<Result<User>>;
    update(user: User): Promise<Result<User>>;
    getUserByKeycloakId(payload: string): Promise<Result<User>>;
}
