import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provide } from '@/di/index';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
import { Resource } from '@/modules/resources/models/Resource';
import { Member } from '@/modules/hr/models/Member';

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
  description?: string;

  @Property({ default: false })
  default?: boolean;

  @Unique()
  @Property()
  key!: string;

  @ManyToMany({
    entity: () => Member,
    mappedBy: (entity) => entity.Infrastructures,
    lazy: true,
    eager: false,
    nullable: true,
  })
  public responsibles? = new Collection<Member>(this);

  @ManyToOne({
    entity: () => Infrastructure,
    nullable: true,
  })
  public parent?: Infrastructure;

  @OneToMany({
    entity: () => Infrastructure,
    mappedBy: 'parent',
    lazy: true,
    eager: false,
  })
  public children? = new Collection<Infrastructure>(this);

  @OneToMany({
    entity: () => Resource,
    mappedBy: (res) => res.infrastructure,
    nullable: true,
    eager: false,
    lazy: true,
  })
  resources? = new Collection<Resource>(this);

  @ManyToOne({ entity: () => Organization, onDelete: 'cascade', nullable: true })
  organization!: Organization;
}
