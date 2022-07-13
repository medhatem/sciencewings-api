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

  @Unique()
  @Property()
  key!: number;

  @OneToOne({
    entity: () => User,
    unique: false,
  })
  public responsable!: User;

  @ManyToOne({
    entity: () => Infrastructure,
    nullable: true,
  })
  public parent?: Infrastructure;

  @OneToMany({ entity: () => Resource, mappedBy: (res) => res.infrastructure, nullable: true })
  resources? = new Collection<Resource>(this);

  @ManyToOne({ entity: () => Organization, onDelete: 'cascade' })
  organization?: Organization;
}
