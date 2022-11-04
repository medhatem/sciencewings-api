import { container, provideSingleton } from '@/di';
import { BaseService } from '@/modules/base/services/BaseService';
import { PermissionDao } from '@/modules/permissions/daos/permissionsDAO';
import { IPermissionService } from '@/modules/permissions/interfaces/IPermissionService';
import { Permission } from '@/modules/permissions/models/permission';
import { log } from '@/decorators/log';
import { createPermissionRO, updatePermissionRO } from '@/modules/permissions/routes/RequestObject';

@provideSingleton(IPermissionService)
export class PermissionService extends BaseService<Permission> implements IPermissionService {
  constructor(public dao: PermissionDao) {
    super(dao);
  }

  static getInstance(): IPermissionService {
    return container.get(IPermissionService);
  }

  @log()
  public async createPermission(payload: createPermissionRO): Promise<number> {
    const wrappedPermission = this.wrapEntity(Permission.getInstance(), {
      name: payload.name,
      module: payload.module,
      operationDB: payload.operationDB,
    });
    const createdProject = await this.create(wrappedPermission);
    return createdProject.id;
  }

  @log()
  public async updatePermission(payload: updatePermissionRO, permissionId: number): Promise<number> {
    const permission = await this.dao.get(permissionId);

    const updatedPermissionResult = await this.update(
      this.wrapEntity(permission, {
        ...permission,
        ...payload,
      }),
    );
    return updatedPermissionResult.id;
  }

  @log()
  public async deletePermission(permissionId: number): Promise<number> {
    const permission = await this.dao.get(permissionId);
    await this.dao.remove(permission);

    return permissionId;
  }
}
