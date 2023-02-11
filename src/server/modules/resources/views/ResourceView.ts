import { Entity, Property } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Resource } from '../models';

@Entity({
  expression:
    'select * from resource, resource_settings where resource.settings_id=resource_settings.id and resource_settings.is_loanable =true',
})
@Entity({
  expression: (em: EntityManager) => {
    return em.createQueryBuilder(Resource, 'b').select(['*']).join('b.author', 'a').join('b.tags', 't').groupBy('b.id');
  },
})
export class ResourceView {
  @Property()
  title!: string;

  @Property()
  authorName!: string;

  @Property()
  tags!: string[];
}
