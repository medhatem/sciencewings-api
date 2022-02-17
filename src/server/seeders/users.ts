import { UserDao } from './../modules/users/daos/UserDao';
import { provideSingleton } from './../di';
// import { config } from './config';
// import fetch from 'node-fetch';
@provideSingleton()
export class SeedUsers {
  constructor(private dao: UserDao) {}

  async createUsers(users: any) {
    const usersInDB = await Promise.all(
      users.map(async (user: any) => {
        const fetchedUser = await this.dao.getByCriteria({ keycloakId: user.id });
        if (fetchedUser === null) {
          const kcuser = {
            keycloakId: user.id,
            email_verified: user.emailVerified,
            name: user.username,
            email: user.email,
            firstname: '',
            lastname: '',
            dateofbirth: new Date(),
            organizations: null as any,
          };

          return await this.dao.create(kcuser);
        } else {
          return fetchedUser;
        }
      }),
    );

    return usersInDB;
  }
}

// export const updateUsers = () => {};
