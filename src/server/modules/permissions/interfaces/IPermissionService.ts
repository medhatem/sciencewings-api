import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { createPermissionRO, updatePermissionRO } from '@/modules/permissions/routes/RequestObject';
import { Permission } from '../models';

export abstract class IPermissionService extends IBaseService<any> {
  static getInstance: () => IPermissionService;

  getAllPermissions: () => Promise<Permission[]>;
  createPermission: (payload: createPermissionRO) => Promise<number>;
  updatePermission: (payload: updatePermissionRO, permissionId: number) => Promise<number>;
  deletePermission: (permissionId: number) => Promise<number>;
}
