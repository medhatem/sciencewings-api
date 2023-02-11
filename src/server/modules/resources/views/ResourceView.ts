import { Organization } from '@/modules/organizations';
import { Entity, Property } from '@mikro-orm/core';

@Entity({
  expression:
    'select * from resource, resource_settings where resource.settings_id=resource_settings.id and resource_settings.is_loanable =true',
})
export class ResourceView {
  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  organization: Organization;
}
