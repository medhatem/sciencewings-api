import { Logger } from '@/utils/Logger';
import { applyToAll } from '@/utils/utilities';
import { connection } from '@/db/index';
import { provideSingleton } from '@/di';
import { PermissionDao } from '@/modules/permissions/daos/permissionsDAO';
import { Permission } from '@/modules/permissions/models/permission';
import { createPermissionRO } from '@/modules/permissions/routes/RequestObject';

/**
 * fill the permission's table from permissions seeds
 */
@provideSingleton()
export class SeedPermissions {
  constructor(private dao: PermissionDao, private logger: Logger) {}

  async createPermission(permissions: createPermissionRO[]) {
    try {
      const repository = connection.em.getRepository(Permission as any);
      await applyToAll(permissions, async (permission) => {
        const res = {
          name: permission.name,
          module: permission.module,
          operationDB: permission.operationDB,
        };

        const resource: any = repository.create(res);
        repository.persist(resource);
        return resource;
      });

      await repository.flush();

      return await this.dao.getAll();
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}
