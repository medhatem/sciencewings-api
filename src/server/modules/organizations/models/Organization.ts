import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property, Unique } from '@mikro-orm/core';
import { container, provide } from '@di/index';

import { BaseModel } from '../../base/models/BaseModel';
import { User } from '@modules/users/models/User';

@provide()
@Entity()
export class Organization extends BaseModel<Organization> {
  constructor() {
    super();
  }

  static getInstance(): Organization {
    return container.get(Organization);
  }
  @Unique({ name: 'res_organisation_name_uniq' })
  @Property()
  name!: string;

  @ManyToMany({ entity: () => User })
  users = new Collection<User>(this);

  // @Property({ nullable: true })
  // parentId: number;

  @ManyToOne({
    entity: () => Organization,
    nullable: true,
  })
  public parent?: Organization;

  @OneToMany({
    entity: () => Organization,
    mappedBy: 'parent',
  })
  public children? = new Collection<Organization>(this);
}
