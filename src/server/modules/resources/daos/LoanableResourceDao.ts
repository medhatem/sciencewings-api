import { container, provideSingleton } from '@/di/index';
import { BaseDao } from '@/modules/base/daos/BaseDao';
import { loanableResource } from '@/modules/resources/models/LoanableResource';

@provideSingleton()
export class loanableResourceDao extends BaseDao<loanableResource> {
  private constructor(public model: loanableResource) {
    super(model);
  }

  static getInstance(): loanableResourceDao {
    return container.get(loanableResourceDao);
  }
}
