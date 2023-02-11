import { Entity, Property } from '@mikro-orm/core';

// @Entity({
//   expression: (em: EntityManager) => {
//     return em.createQueryBuilder(Resource, 'b').select(['*']).groupBy('b.id');
//   },
// })

@Entity({
  expression:
    'SELECT name, description, ' +
    ' FROM resource R , resource_settings RS' +
    ' WHERE R.settings_id = RS.id AND  RS.is_loanable = true ' +
    ' GROUP BY  R.id' +
    ' ORDER BY R.id',
})
export class lonabbleResource {
  @Property()
  name: string;
  @Property()
  description: string;
}
