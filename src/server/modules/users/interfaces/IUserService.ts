import { ResetPasswordRO, UserDetailsRO } from '../routes/RequstObjects';

import { KeycloakUserInfo } from '../../../types/UserRequest';
import { Result } from '@utils/Result';
import { User } from '../models/User';
import { UserService } from '../services/UserService';

export abstract class IUserService {
  getInstance: () => UserService;

  updateUserDetails: (payload: UserDetailsRO, userId: number) => Promise<Result<number>>;

  registerUser: (userInfo: KeycloakUserInfo) => Promise<Result<number>>;

  getUserByCriteria: (criteria: { [key: string]: any }) => Promise<Result<User>>;

  inviteUserByEmail: (email: string, orgId: number) => Promise<Result<number>>;

  resetPassword: (payload: ResetPasswordRO) => Promise<Result<string>>;
}
