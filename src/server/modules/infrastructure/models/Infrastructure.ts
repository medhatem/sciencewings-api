import { Collection, Entity, ManyToOne, OneToMany, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provide } from '@/di/index';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
import { User } from '@/modules/users/models/User';
import { Resource } from '@/modules/resources/models/Resource';

@provide()
@Entity()
export class Infrastructure extends BaseModel<Infrastructure> {
  constructor() {
    super();
  }

  static getInstance(): Infrastructure {
    return container.get(Infrastructure);
  }

  @PrimaryKey()
  id?: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description!: string;

  @Unique({ key: 'infrastructure_key_uniq' })
  @Property()
  key!: string;

  @OneToOne({
    entity: () => User,
    unique: false,
  })
  public responsable!: User;

  @ManyToOne({ entity: () => Organization, onDelete: 'set null', nullable: true })
  organization?: Organization;

  @OneToMany({ entity: () => Resource, mappedBy: (res) => res.infrastructure, nullable: true })
  resources? = new Collection<Resource>(this);
}
