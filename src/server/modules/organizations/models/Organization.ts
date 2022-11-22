import { Collection, Entity, ManyToOne, OneToMany, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { Address } from '@/modules/address/models/Address';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { Job } from '@/modules/hr/models/Job';
import { Member } from '@/modules/hr/models/Member';
import { OrganizationLabel } from '@/modules/organizations/models/OrganizationLabel';
import { OrganizationSettings } from './OrganizationSettings';
import { Phone } from '@/modules/phones/models/Phone';
import { Resource } from '@/modules/resources/models/Resource';
import { ResourceTag } from '@/modules/resources/models/ResourceTag';
import { User } from '@/modules/users/models/User';
import { WorkLocation } from '@/modules/hr/models/WorkLocation';
import { Calendar } from '@/modules/reservation';
export enum OrganizationType {
  PUBLIC = 'Public',
  SERVICE = 'Service',
  INSTITUT = 'Institut',
}

@provide()
@Entity()
export class Organization extends BaseModel<Organization> {
  constructor() {
    super();
  }

  static getInstance(): Organization {
    return container.get(Organization);
  }

  @PrimaryKey()
  id?: number;

  @Property()
  kcid!: string;

  @Property()
  memberGroupkcid!: string;

  @Property()
  adminGroupkcid!: string;

  @Unique({ name: 'organization_name_uniq' })
  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property()
  email!: string;

  @OneToOne({
    entity: () => Phone,
    nullable: true,
  })
  phone?: Phone;

  // e.i: Public, Service, Institut
  @Property()
  type!: OrganizationType;

  @OneToMany({
    entity: () => Address,
    mappedBy: (entity) => entity.organization,
    lazy: true,
    eager: false,
  })
  public addresses = new Collection<Address>(this);

  @OneToMany({
    entity: () => OrganizationLabel,
    mappedBy: (entity) => entity.organization,
    lazy: true,
    eager: false,
  })
  public labels? = new Collection<OrganizationLabel>(this);

  @OneToMany({
    entity: () => WorkLocation,
    mappedBy: (entity) => entity.organization,
    lazy: true,
    eager: false,
  })
  public worklocations? = new Collection<WorkLocation>(this);

  @OneToMany({
    entity: () => Job,
    mappedBy: (entity) => entity.organization,
    lazy: true,
    eager: false,
  })
  public jobs? = new Collection<Job>(this);

  @OneToMany({ entity: () => Member, mappedBy: (entity) => entity.organization, eager: false, lazy: true })
  members? = new Collection<Member>(this);

  @Property({ nullable: true })
  socialFacebook?: string;

  @Property({ nullable: true })
  socialTwitter?: string;

  @Property({ nullable: true })
  socialGithub?: string;

  @Property({ nullable: true })
  socialLinkedin?: string;

  @Property({ nullable: true })
  socialYoutube?: string;

  @Property({ nullable: true })
  socialInstagram?: string;

  @OneToOne({
    entity: () => User,
    unique: false,
  })
  public owner!: User;

  @OneToMany({ entity: () => Resource, nullable: true, mappedBy: (entity) => entity.organization })
  resources? = new Collection<Resource>(this);

  @ManyToOne({
    entity: () => Organization,
    nullable: true,
  })
  public parent?: Organization;

  @OneToMany({
    entity: () => Organization,
    mappedBy: 'parent',
    lazy: true,
    eager: false,
  })
  public children? = new Collection<Organization>(this);

  @OneToMany({ entity: () => Infrastructure, mappedBy: (entity) => entity.organization })
  public infrastructure? = new Collection<Infrastructure>(this);

  @OneToMany({
    entity: () => ResourceTag,
    mappedBy: 'organization',
    lazy: true,
    eager: false,
  })
  public tags? = new Collection<ResourceTag>(this);

  @OneToOne({ entity: () => OrganizationSettings, nullable: true })
  settings?: OrganizationSettings;

  @OneToMany({ entity: () => Calendar, mappedBy: (member) => member.organization, nullable: true })
  calendar? = new Collection<Calendar>(this);
}
