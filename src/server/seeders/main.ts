import { createKCUsers, getKCUsers } from './keycloak';

import { Configuration } from '@/configuration/Configuration';
import { SeedMembers } from './members';
import { SeedOrganizations } from './organizations';
import { SeedResources } from './resources';
import { SeedUsers } from './users';
import { container } from '@/di/index';
import { getConfig } from '@/configuration/Configuration';
import { provideSingleton } from '@/di';
import { startDB } from '@/db/index';

@provideSingleton()
export class Seeders {
  constructor(
    private seedUsers: SeedUsers,
    private seedOrganizations: SeedOrganizations,
    private seedResources: SeedResources,
    private seedMembers: SeedMembers,
  ) {}

  static getInstance(): Seeders {
    return container.get(Seeders);
  }

  async main() {
    // generate keycloak users
    await createKCUsers();
    const KDUsers = await getKCUsers();
    // remove admin
    KDUsers.shift();
    // register keycloak users
    const users = await this.seedUsers.createUsers(KDUsers);
    // creating organizations
    let organizations = await this.seedOrganizations.createOrganizations(users);
    // assiging labels to each organization
    organizations = await this.seedOrganizations.createLabels(organizations);
    // creating resources
    const resources = await this.seedResources.createResources(users, organizations);
    // creating members
    await this.seedMembers.createMembersForOrganization(organizations, resources);
  }
}

if (process.argv[1].includes('dist/server/seeders/main.js')) {
  (async () => {
    // setup configs
    Configuration.getInstance().init();
    // setup dbs
    await startDB(getConfig('DB'));
    // start seeding proccess
    const seed = Seeders.getInstance();
    seed.main();
  })();
}
