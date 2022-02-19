import { User } from '@/modules/users/models/User';
import { UserDao } from '@/modules/users/daos/UserDao';
import { connection } from './../db/index';
import { faker } from '@faker-js/faker';
import { provideSingleton } from './../di';
import { wrap } from '@mikro-orm/core';
@provideSingleton()
export class SeedUsers {
  constructor(private dao: UserDao) {}

  async createUsers(users: any) {
    const repository = connection.em.getRepository(User as any);
    await Promise.all(
      users.map(async (user: any) => {
        const fetchedUser = await this.dao.getByCriteria({ keycloakId: user.id });

        if (fetchedUser) {
          return fetchedUser;
        }

        const kcuser = {
          keycloakId: user.id,
          email_verified: user.emailVerified,
          name: user.username,
          email: user.email,
          firstname: faker.name.firstName(),
          lastname: faker.name.findName(),
        };

        const _kcuser = wrap(new User()).assign(kcuser as any);
        const persistedUser = repository.create(_kcuser as any);
        repository.persist(persistedUser);
        return persistedUser;
      }),
    );
    await repository.flush();
    return await this.dao.getAll();
  }
}

// export const updateUsers = () => {};
