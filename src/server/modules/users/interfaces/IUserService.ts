import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { KeycloakUserInfo } from '@/types/UserRequest';
import { ResetPasswordRO } from '@/modules/users/routes/RequstObjects';
import { User } from '@/modules/users/models/User';
import { UserRO } from '@/modules/users/routes/RequstObjects';

export abstract class IUserService extends IBaseService<any> {
  static getInstance: () => IUserService;

  updateUserDetails: (payload: UserRO, userId: number) => Promise<number>;
  registerUser: (userInfo: KeycloakUserInfo) => Promise<number>;
  getUserByCriteria: (criteria: { [key: string]: any }) => Promise<User>;
  resetPassword: (payload: ResetPasswordRO) => Promise<string>;

  createUser: (user: UserRO) => Promise<User>;
  updateUserByKeycloakId: (user: UserRO, keycloakId: string) => Promise<User>;

  getUserByKeycloakId: (payload: string) => Promise<User>;

  changeUserLanguage: (languague: string, userId: number) => Promise<number>;
}
