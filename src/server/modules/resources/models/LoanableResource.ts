import { container } from '@/di/index';
import { Entity, Property } from '@mikro-orm/core';
import { provide } from '@/di/index';
import { BaseModel } from '@/modules/base';

// @Entity({
//   expression: (em: EntityManager) => {
//     return em.createQueryBuilder(Resource, 'b').select(['*']).groupBy('b.id');
//   },
// })

@provide()
@Entity({
  expression:
    'SELECT R.name, R.description, ' +
    '(SELECT kcid FROM organization WHERE organization.id = R.organization_id) as kcid ' +
    'FROM resource R ' +
    'JOIN resource_settings RS ' +
    ' ON R.settings_id = RS.id ' +
    'JOIN organization ' +
    ' ON R.organization_id = organization.id ' +
    'WHERE RS.is_loanable = true ' +
    'GROUP BY R.id ' +
    'ORDER BY R.id',
})
export class loanableResource extends BaseModel<loanableResource> {
  constructor() {
    super();
  }

  static getInstance(): loanableResource {
    return container.get(loanableResource);
  }
  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  kcid: string;
}
