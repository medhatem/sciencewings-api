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
import { Job, WorkLocation } from '@/modules/hr';

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
    eager: false,
    lazy: true,
  })
  public address = new Collection<Address>(this);

  @OneToMany({
    entity: () => OrganizationLabel,
    mappedBy: (entity) => entity.organization,
    eager: false,
    lazy: true,
  })
  public labels? = new Collection<OrganizationLabel>(this);

  @OneToMany({
    entity: () => WorkLocation,
    mappedBy: (entity) => entity.organization,
    eager: false,
    lazy: true,
  })
  public worklocations? = new Collection<WorkLocation>(this);

  @OneToMany({
    entity: () => Job,
    mappedBy: (entity) => entity.organization,
    eager: false,
    lazy: true,
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
    eager: false,
    lazy: true,
  })
  public admin_contact!: User;

  @OneToMany({ entity: () => Resource, nullable: true, mappedBy: (entity) => entity.organization, eager: false })
  resources? = new Collection<Resource>(this);

  @ManyToOne({
    entity: () => Organization,
    nullable: true,
    eager: false,
    lazy: true,
  })
  public parent?: Organization;

  @OneToMany({
    entity: () => Organization,
    mappedBy: 'parent',
    eager: false,
    lazy: true,
  })
  public children? = new Collection<Organization>(this);
}
