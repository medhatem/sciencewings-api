import { Configuration } from './../configuration/Configuration';
import { SeedOrganizations } from './organizations';
import { SeedUsers } from './users';
import { container } from './../di/index';
import { generateKCUsers } from './keycloak';
import { getConfig } from '@/configuration/Configuration';
import { provideSingleton } from './../di';
import { startDB } from '@/db';

@provideSingleton()
export class Seeders {
  constructor(private seedUsers: SeedUsers, private seedOrganizations: SeedOrganizations) {}

  static getInstance(): Seeders {
    return container.get(Seeders);
  }

  async main() {
    // generate keycloak users
    const KDUsers = await generateKCUsers();
    // remove admin
    KDUsers.shift();
    // register keycloak users
    const users = await this.seedUsers.createUsers(KDUsers);
    // register organizations
    let organizations = await this.seedOrganizations.createOgranizations(users);
    // assiging labels to each organization
    organizations = await this.seedOrganizations.createLabels(organizations);
    console.log({ organizations });
  }
}

if (process.argv[1].includes('dist/server/seeders/main.js')) {
  (async () => {
    // setup configs
    Configuration.getInstance().init();
    // setup dbs
    await startDB(getConfig('DB'));
    // start proccess
    const seed = Seeders.getInstance();
    seed.main();
  })();
}
