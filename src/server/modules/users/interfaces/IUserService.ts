import { ResetPasswordRO, UserDetailsRO } from '../routes/RequstObjects';

import { KeycloakUserInfo } from '../../../types/UserRequest';
import { Result } from '@utils/Result';

export abstract class IUserService {
  static getInstance: () => IUserService;

  updateUserDetails: (payload: UserDetailsRO, userId: number) => Promise<Result<number>>;

  registerUser: (userInfo: KeycloakUserInfo) => Promise<Result<number>>;

  getUserByCriteria: (criteria: { [key: string]: any }) => Promise<any>;

  inviteUserByEmail: (email: string, orgId: number) => Promise<Result<number>>;

  resetPassword: (payload: ResetPasswordRO) => Promise<Result<string>>;
}
