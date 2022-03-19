import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, Property, Unique } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { Address } from '@/modules/address/models/AdressModel';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Member } from '@/modules/hr/models/Member';
import { OrganizationLabel } from '@/modules/organizations/models/OrganizationLabel';
import { Phone } from '@/modules/phones/models/Phone';
import { User } from '@/modules/users/models/User';
import { Resource } from '@/modules/resources';

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
  @Unique({ name: 'organization_name_uniq' })
  @Property()
  name!: string;

  @Property()
  @Unique()
  email!: string;

  @OneToMany({
    entity: () => Phone,
    mappedBy: (entity) => entity.organization,
  })
  public phones = new Collection<Phone>(this);

  // e.i: Public, Service, Institut
  @Property()
  type!: OrganizationType;

  @OneToMany({
    entity: () => Address,
    mappedBy: (entity) => entity.organization,
  })
  public address = new Collection<Address>(this);

  @OneToMany({
    entity: () => OrganizationLabel,
    mappedBy: (entity) => entity.organization,
  })
  public labels? = new Collection<OrganizationLabel>(this);

  @ManyToMany({ entity: () => Member })
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

  @OneToMany({ entity: () => Resource, nullable: true, mappedBy: (entity) => entity.organization })
  resources?: Resource;

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
}
