import { Configuration } from '@/configuration/Configuration';
import { SeedPermissions } from './permission';
import { container } from '@/di/index';
import { getConfig } from '@/configuration/Configuration';
import { provideSingleton } from '@/di';
import { startDB } from '@/db/index';
import { permissionSeeds } from './permissionseeds';

@provideSingleton()
export class PermissionSeeders {
  constructor(private SeedPermissions: SeedPermissions) {}

  static getInstance(): PermissionSeeders {
    return container.get(PermissionSeeders);
  }

  async main() {
    await this.SeedPermissions.createPermission(permissionSeeds);
  }
}

(async () => {
  // setup configs
  Configuration.getInstance().init();
  // setup dbs
  await startDB(getConfig('DB'));
  // start seeding proccess
  const seed = PermissionSeeders.getInstance();
  seed.main();
})();
