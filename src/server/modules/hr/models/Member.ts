import { Collection, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import { User, userStatus } from '@/modules/users/models/User';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Contract } from './Contract';
import { Group } from './Group';
import { Job } from './Job';
import { Organization } from '@/modules/organizations/models/Organization';
import { Phone } from '@/modules/phones/models/Phone';
import { ProjectTask } from '@/modules/projects/models/ProjectTask';
import { Resource } from '@/modules/resources/models/Resource';
import { ResourceCalendar } from '@/modules/resources/models/ResourceCalendar';
import { ResourceStatusHistory } from '@/modules/resources/models/ResourceStatusHistory';
import { WorkLocation } from './WorkLocation';
import { ProjectMember } from '@/modules/projects/models/ProjectMember';

export enum MemberTypeEnum {
  ADMIN = 'admin',
  REGULAR = 'regular',
}

export enum MembershipStatus {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

@provide()
@Entity()
export class Member extends BaseModel<Member> {
  constructor() {
    super();
  }

  static getInstance(): Member {
    return container.get(Member);
  }

  @ManyToOne({
    entity: () => Organization,
    onDelete: 'cascade',
    primary: true,
    unique: false,
  })
  organization!: Organization;

  @OneToOne({
    entity: () => User,
    onDelete: 'set null',
    nullable: true,
    primary: true,
    unique: false,
  })
  user!: User;

  [PrimaryKeyType]?: [Organization, User];

  @Property()
  membership: MembershipStatus;

  @ManyToOne({
    entity: () => ResourceCalendar,
    onDelete: 'set null',
    nullable: true,
  })
  resourceCalendar?: ResourceCalendar;

  @ManyToMany({
    entity: () => Resource,
    nullable: true,
    lazy: true,
    eager: false,
  })
  resources? = new Collection<Resource>(this);

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
  workLocation?: WorkLocation;

  @ManyToOne({ entity: () => Member, onDelete: 'set null', nullable: true })
  parent?: Member;

  @ManyToOne({ entity: () => Member, onDelete: 'set null', nullable: true })
  coach?: Member;

  @Property()
  memberType!: MemberTypeEnum;

  @Property({ columnType: 'date', nullable: true })
  birthday?: Date;

  @Property({ nullable: true })
  identificationId?: string;

  @Property({ nullable: true })
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

  @Property({ columnType: 'date', nullable: true })
  joinedDate?: Date;

  @Property({ columnType: 'timestamp', nullable: true })
  joinDate?: Date = new Date();

  @ManyToOne({ entity: () => Contract, onDelete: 'set null', nullable: true })
  contract?: Contract;

  // @ManyToMany(() => Project, (project) => project.managers)
  // porjectManagers? = new Collection<Project>(this);

  // @ManyToMany(() => Project, (project) => project.participants)
  // projectParticipants? = new Collection<Project>(this);

  @Property({ nullable: true })
  status?: userStatus;

  @ManyToMany({
    entity: () => ResourceStatusHistory,
    nullable: true,
  })
  resourceStatusHistory? = new Collection<ResourceStatusHistory>(this);

  @ManyToMany({ entity: () => ProjectTask, nullable: true })
  task? = new Collection<ProjectTask>(this);

  @ManyToOne({ entity: () => ProjectMember, onDelete: 'cascade', nullable: true })
  projectMember? = new Collection<ProjectMember>(this);
}
