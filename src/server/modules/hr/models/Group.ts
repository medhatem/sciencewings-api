import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Member } from '@/modules/hr/models/Member';
import { Organization } from '@/modules/organizations/models/Organization';

@provide()
@Entity()
export class Group extends BaseModel<Group> {
  constructor() {
    super();
  }

  static getInstance(): Group {
    return container.get(Group);
  }

  @PrimaryKey()
  id?: number;

  @Property()
  kcid!: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  active?: boolean;

  @ManyToOne({ entity: () => Organization })
  organization!: Organization;

  @ManyToOne({
    entity: () => Group,
    onDelete: 'set null',
    nullable: true,
  })
  parent?: Group;

  @OneToMany({ entity: () => Member, mappedBy: (member) => member.group, nullable: true })
  members? = new Collection<Member>(this);

  @Property({ columnType: 'text', nullable: true })
  description?: string;
}
