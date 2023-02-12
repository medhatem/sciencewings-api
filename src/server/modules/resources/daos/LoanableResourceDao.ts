import { container, provideSingleton } from '@/di/index';
import { BaseDao } from '@/modules/base/daos/BaseDao';
import { loanableResource } from '@/modules/resources/models/LoanableResource';

@provideSingleton()
export class LoanableResourceDao extends BaseDao<loanableResource> {
  private constructor(public model: loanableResource) {
    super(model);
  }

  static getInstance(): LoanableResourceDao {
    return container.get(LoanableResourceDao);
  }
}
