import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@di/index';

import { BaseModel } from '@/modules//base/models/BaseModel';
import { Member } from './Member';
import { Organization } from '@/modules/organizations/models/Organization';

@provideSingleton()
@Entity()
export class Group extends BaseModel<Group> {
  constructor() {
    super();
  }

  static getInstance(): Group {
    return container.get(Group);
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  completeName?: string;

  @Property({ nullable: true })
  active?: boolean;

  @ManyToOne({
    entity: () => Organization,
    onDelete: 'set null',
    nullable: true,
    index: 'hr_group_organization_id_index',
  })
  organization?: Organization;

  @ManyToOne({
    entity: () => Group,
    onDelete: 'set null',
    nullable: true,
    index: 'hr_group_parent_id_index',
  })
  parent?: Group;

  @ManyToOne({ entity: () => Member, onDelete: 'set null', nullable: true })
  manager?: Member;

  @Property({ columnType: 'text', nullable: true })
  note?: string;
}
