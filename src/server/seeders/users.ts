import { IUserService } from '@/modules/users/interfaces';
import { KeycloakUserInfo } from '@/types/UserRequest';
import { UserDao } from './../modules/users/daos/UserDao';
import { UserService } from './../modules/users/services/UserService';
// import { config } from './config';
// import fetch from 'node-fetch';

export class SeedUsers {
  constructor(private userService: IUserService) {}

  async createUsers(users: any) {
    await Promise.all(
      users.map(async (user: any) => {
        const kcuser: KeycloakUserInfo = {
          email_verified: user.emailVerified,
          name: user.username,
          email: user.email,
          address: {},
          groups: [],
          preferred_username: '',
          given_name: '',
          family_name: '',
        };

        await this.userService.registerUser(kcuser);
      }),
    );
  }
}

// export const updateUsers = () => {};
