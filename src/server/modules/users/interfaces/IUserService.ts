import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { KeycloakUserInfo } from '@/types/UserRequest';
import { ResetPasswordRO } from '@/modules/users/routes/RequstObjects';
import { Result } from '@/utils/Result';
import { User } from '@/modules/users/models';
import { UserRO } from '@/modules/users/routes/RequstObjects';

export abstract class IUserService extends IBaseService<any> {
  static getInstance: () => IUserService;

  updateUserDetails: (payload: UserRO, userId: number) => Promise<Result<number>>;
  registerUser: (userInfo: KeycloakUserInfo) => Promise<Result<number>>;
  getUserByCriteria: (criteria: { [key: string]: any }) => Promise<Result<User>>;
  resetPassword: (payload: ResetPasswordRO) => Promise<Result<string>>;

  createUser: (user: UserRO) => Promise<Result<User>>;
  updateUserByKeycloakId: (user: UserRO, keycloakId: string) => Promise<Result<User>>;

  getUserByKeycloakId: (payload: string) => Promise<Result<User>>;
}
