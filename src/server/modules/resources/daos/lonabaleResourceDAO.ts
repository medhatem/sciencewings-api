import { container, provideSingleton } from '@/di/index';
import { BaseDao } from '@/modules/base/daos/BaseDao';
import { lonabbleResource } from '@/modules/resources/models/lonabaleResources';

@provideSingleton()
export class lonabaleResourceDao extends BaseDao<lonabbleResource> {
  private constructor(public model: lonabbleResource) {
    super(model);
  }

  static getInstance(): lonabaleResourceDao {
    return container.get(lonabaleResourceDao);
  }
}
