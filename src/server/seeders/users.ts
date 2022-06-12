import { User } from '@/modules/users/models/User';
import { UserDao } from '@/modules/users/daos/UserDao';
import { connection } from '@/db/index';
import { faker } from '@faker-js/faker';
import { provideSingleton } from '@/di';
import { wrap } from '@mikro-orm/core';
import { Logger } from '@/utils/Logger';
import { applyToAll } from '@/utils/utilities';

@provideSingleton()
export class SeedUsers {
  constructor(private dao: UserDao, private logger: Logger) {}

  /**
   * registering Keycloack users in db
   */
  async createUsers(users: any) {
    try {
      const repository = connection.em.getRepository(User as any);
      await applyToAll(users, async (user: any) => {
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

        const createdKCUser = wrap(new User()).assign(kcuser as any);
        const persistedUser = repository.create(createdKCUser as any);
        repository.persist(persistedUser);
        return persistedUser;
      });

      await repository.flush();
      return await this.dao.getAll();
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}
