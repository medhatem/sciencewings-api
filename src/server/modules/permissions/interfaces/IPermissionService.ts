import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { createPermissionRO, updatePermissionRO } from '@/modules/permissions/routes/RequestObject';

export abstract class IPermissionService extends IBaseService<any> {
  createPermission: (payload: createPermissionRO) => Promise<number>;
  updatePermission: (payload: updatePermissionRO, permissionId: number) => Promise<number>;
  deletePermission: (permissionId: number) => Promise<number>;
}
