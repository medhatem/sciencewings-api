import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Permission } from '../models';

@provideSingleton()
export class PermissionDao extends BaseDao<Permission> {
  private constructor(public model: Permission) {
    super(model);
  }

  static getInstance(): PermissionDao {
    return container.get(PermissionDao);
  }
}
