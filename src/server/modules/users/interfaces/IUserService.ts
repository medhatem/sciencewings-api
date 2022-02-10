import { ResetPasswordRO, UserDetailsRO } from '../routes/RequstObjects';

import { KeycloakUserInfo } from '../../../types/UserRequest';
import { Result } from '@utils/Result';
import { User } from '@modules/users/models';
import { KeycloakIdRO } from '@modules/users/routes/RequstObjects';

export abstract class IUserService {
  static getInstance: () => IUserService;

  updateUserDetails: (payload: UserDetailsRO, userId: number) => Promise<Result<number>>;
  registerUser: (userInfo: KeycloakUserInfo) => Promise<Result<number>>;
  getUserByCriteria: (criteria: { [key: string]: any }) => Promise<any>;
  resetPassword: (payload: ResetPasswordRO) => Promise<Result<string>>;

  create: (user: User) => Promise<Result<User>>;
  update: (user: User) => Promise<Result<User>>;

  getUserByKeycloakId: (payload: KeycloakIdRO) => Promise<Result<User>>;
}
