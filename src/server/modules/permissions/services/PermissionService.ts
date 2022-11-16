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

  /**
   * get all permission from the database
   */
  @log()
  public async getAllPermissions(): Promise<Permission[]> {
    const permissions = await this.dao.getAll();
    return permissions;
  }

  /**
   *  create a permission in the database
   * @param payload Should contain the permission data
   */
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

  /**
   * update a permission in the database
   * @param id of the permission data
   * @param payload Should contain the permission data
   */
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

  /**
   * delete a permission in the database
   * @param id of the permission data
   */
  @log()
  public async deletePermission(permissionId: number): Promise<number> {
    const permission = await this.dao.get(permissionId);
    await this.dao.remove(permission);

    return permissionId;
  }
}
