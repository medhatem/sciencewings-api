import { Collection, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { Address } from '@/modules/address/models/AdressModel';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Contract } from './Contract';
import { Group } from './Group';
import { Job } from './Job';
import { Organization } from '@/modules/organizations/models/Organization';
import { Phone } from '@/modules/phones/models/Phone';
import { Project } from '@/modules/projects/models/Project';
import { Resource } from '@/modules/resources/models/Resource';
import { ResourceCalendar } from '@/modules/resources/models/ResourceCalendar';
import { User } from '@/modules/users/models/User';
import { WorkLocation } from './WorkLocation';

export enum MemberStatusType {
  INVITATION_PENDING = 'INVITATION_PENDING',
  ACTIVE = 'ACTIVE',
}
@provideSingleton()
@Entity()
@Unique({ name: 'hr_member_user_uniq', properties: ['organization', 'user'] })
export class Member extends BaseModel<Member> {
  constructor() {
    super();
  }

  static getInstance(): Member {
    return container.get(Member);
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne({
    entity: () => Resource,
    index: 'hr_member_resource_id_index',
  })
  resource!: Resource;

  @ManyToOne({
    entity: () => Organization,
    nullable: true,
  })
  organization: Organization;

  @ManyToOne({
    entity: () => ResourceCalendar,
    onDelete: 'set null',
    nullable: true,
    index: 'hr_member_resource_calendar_id_index',
  })
  resourceCalendar?: ResourceCalendar;

  @Property({ nullable: true })
  name?: string;

  @Property({ nullable: true })
  active?: boolean;

  @ManyToOne({ entity: () => Group, onDelete: 'set null', nullable: true })
  group?: Group;

  @ManyToOne({ entity: () => Job, onDelete: 'set null', nullable: true })
  job?: Job;

  @Property({ nullable: true })
  jobTitle?: string;

  @OneToOne({ entity: () => Phone, nullable: true })
  workPhone?: Phone;

  @Property({ nullable: true })
  workEmail?: string;

  @ManyToOne({ entity: () => WorkLocation, onDelete: 'set null', nullable: true })
  workLocation?: Address;

  @OneToOne({ entity: () => User, onDelete: 'set null', nullable: true })
  user?: User;

  @ManyToOne({ entity: () => Member, onDelete: 'set null', nullable: true })
  parent?: Member;

  @ManyToOne({ entity: () => Member, onDelete: 'set null', nullable: true })
  coach?: Member;

  @Property()
  memberType!: string;

  @Property({ columnType: 'date', nullable: true })
  birthday?: Date;

  @Property({ nullable: true })
  identificationId?: string;

  certificate?: string;

  @Property({ nullable: true })
  studyField?: string;

  @Property({ nullable: true })
  emergencyContact?: string;

  @OneToOne({ entity: () => Phone, nullable: true })
  emergencyPhone?: Phone;

  @Property({ columnType: 'text', nullable: true })
  notes?: string;

  @Property({ columnType: 'text', nullable: true })
  departureDescription?: string;

  @Property({ columnType: 'date', nullable: true })
  departureDate?: Date;

  @ManyToOne({ entity: () => Contract, onDelete: 'set null', nullable: true })
  contract?: Contract;

  @ManyToMany(() => Project, (project) => project.managers)
  managers? = new Collection<Project>(this);

  @ManyToMany(() => Project, (project) => project.participants)
  participants? = new Collection<Project>(this);

  @Property({ nullable: true })
  status?: MemberStatusType;
}
