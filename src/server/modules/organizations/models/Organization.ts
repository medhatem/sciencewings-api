import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { container, provide } from '@/di/index';
import { Address } from '@/modules/address/models/Address';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Member } from '@/modules/hr/models/Member';
import { OrganizationLabel } from '@/modules/organizations/models/OrganizationLabel';
import { Phone } from '@/modules/phones/models/Phone';
import { User } from '@/modules/users/models/User';
import { Resource } from '@/modules/resources';
import { Job } from '@/modules/hr/models/Job';
import { OrganizationSettings } from './OrganizationSettings';
import { WorkLocation } from '@/modules/hr/models/WorkLocation';

export enum OrganizationType {
  PUBLIC = 'Public',
  SERVICE = 'Service',
  INSTITUT = 'Institut',
}

export enum OrganizationCategory {
  PODUCTION = 'Production',
  CONSTRUCTION = 'Construction',
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

  @Unique({ name: 'organization_name_uniq' })
  @Property()
  name!: string;

  @Property({ nullable: true })
  description!: string;

  @Property()
  @Unique()
  email!: string;

  @ManyToMany({
    entity: () => Phone,
    mappedBy: (entity) => entity.organization,
  })
  public phones = new Collection<Phone>(this);

  // e.i: Public, Service, Institut
  @Property()
  type!: OrganizationType;

  @ManyToMany({
    entity: () => Address,
    mappedBy: (entity) => entity.organization,
  })
  public address = new Collection<Address>(this);

  @OneToMany({
    entity: () => OrganizationLabel,
    mappedBy: (entity) => entity.organization,
  })
  public labels? = new Collection<OrganizationLabel>(this);

  @OneToMany({
    entity: () => WorkLocation,
    mappedBy: (entity) => entity.organization,
  })
  public worklocations? = new Collection<WorkLocation>(this);

  @OneToMany({
    entity: () => Job,
    mappedBy: (entity) => entity.organization,
  })
  public jobs? = new Collection<Job>(this);

  @ManyToMany({ entity: () => Member, eager: false })
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
  })
  public direction!: User;

  @OneToOne({
    entity: () => User,
  })
  public admin_contact!: User;

  @OneToMany({ entity: () => Resource, nullable: true, mappedBy: (entity) => entity.organization, eager: false })
  resources? = new Collection<Resource>(this);

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

  @Property({ nullable: true })
  website: string;

  @Property({ nullable: true })
  identificationNumber: Number;

  @Property({ nullable: true })
  category: OrganizationCategory;

  @Property({ nullable: true })
  activity: string;

  @OneToOne({ entity: () => OrganizationSettings, nullable: true })
  settings: OrganizationSettings;
}
