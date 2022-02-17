import { SeedUsers } from './users';
import { container } from './../di/index';
import { generateKCUsers } from './keycloak';
import { provideSingleton } from './../di';

@provideSingleton()
export class Seeders {
  constructor(private seedUser: SeedUsers) {}

  static getInstance(): Seeders {
    return container.get(Seeders);
  }

  async main() {
    const KDUsers = await generateKCUsers();
    const users = this.seedUser.createUsers(KDUsers);
    console.log({ users });
  }
}

const seed = Seeders.getInstance();
seed.main();
