import {
  Collection,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { User, userStatus } from '@/modules/users/models/User';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Calendar } from '@/modules/reservation/models/Calendar';
import { Contract } from '@/modules/hr/models/Contract';
import { Group } from '@/modules/hr/models/Group';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { Job } from '@/modules/hr/models/Job';
import { Organization } from '@/modules/organizations/models/Organization';
import { Phone } from '@/modules/phones/models/Phone';
import { Project } from '@/modules/projects/models/Project';
import { ProjectMember } from '@/modules/projects/models/ProjectMember';
import { ProjectTask } from '@/modules/projects/models/ProjectTask';
import { Resource } from '@/modules/resources/models/Resource';
import { ResourceStatusHistory } from '@/modules/resources/models/ResourceStatusHistory';
import { WorkLocation } from './WorkLocation';
import { FullTextType } from '@mikro-orm/postgresql';

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
    entity: () => Calendar,
    onDelete: 'set null',
    nullable: true,
  })
  resourceCalendar?: Calendar;

  @ManyToMany({ entity: () => Resource })
  resources? = new Collection<Resource>(this);

  @OneToMany({
    entity: () => Infrastructure,
    mappedBy: (entity) => entity.responsible,
    nullable: true,
  })
  public Infrastructures? = new Collection<Infrastructure>(this);

  @Property({ nullable: true })
  name!: string;

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

  @Index({ type: 'fulltext' })
  @Property({ type: FullTextType, nullable: true })
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

  @OneToMany({
    entity: () => Contract,
    mappedBy: (entity) => entity.member,
    nullable: true,
    lazy: true,
    eager: false,
  })
  public contract? = new Collection<Contract>(this);

  @ManyToMany({ entity: () => Project, owner: true, pivotEntity: () => ProjectMember })
  projects? = new Collection<Project>(this);

  @Property({ nullable: true })
  status?: userStatus;

  @ManyToMany({
    entity: () => ResourceStatusHistory,
    nullable: true,
  })
  resourceStatusHistory? = new Collection<ResourceStatusHistory>(this);

  @ManyToMany({ entity: () => ProjectTask, nullable: true })
  task? = new Collection<ProjectTask>(this);

  @OneToMany({
    entity: () => Contract,
    mappedBy: (entity) => entity.supervisor,
    nullable: true,
    lazy: true,
    eager: false,
  })
  public contractSupervized? = new Collection<Contract>(this);
}
