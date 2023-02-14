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
    'SELECT R.name, R.description, R.resource_type, R.resource_class, ' +
    '(SELECT id FROM organization WHERE organization.id = R.organization_id) as orgId, ' +
    '(SELECT status_type FROM resource_status WHERE resource_status.id = R.status_id) as status_type, ' +
    '(SELECT status_description FROM resource_status WHERE resource_status.id = R.status_id) as status_description ' +
    'FROM resource R ' +
    'JOIN resource_settings RS ' +
    ' ON R.settings_id = RS.id ' +
    'JOIN organization ' +
    ' ON R.organization_id = organization.id ' +
    'JOIN resource_status ' +
    ' ON R.status_id = resource_status.id ' +
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
  orgId: number;

  @Property()
  status_type: string;

  @Property()
  status_description: string;

  @Property()
  resourceClass: string;

  @Property()
  resourceType: string;
}
