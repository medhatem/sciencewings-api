import { Address } from '../../address/models/AdressModel';
import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, Property, Unique } from '@mikro-orm/core';
import { container, provide } from '@di/index';
import { BaseModel } from '../../base/models/BaseModel';
import { User } from '@modules/users/models/User';
import { OrganizationLabel } from '@modules/organizations/models/OrganizationLabel';
import { Phone } from '@modules/phones/models/Phone';

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
  @Unique({ name: 'res_organization_name_uniq' })
  @Property()
  name!: string;

  @Property()
  @Unique()
  email!: string;

  @OneToMany({
    entity: () => Phone,
    mappedBy: (entity) => entity.organization,
  })
  phone!: Phone;

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

  @ManyToMany({ entity: () => User })
  members? = new Collection<User>(this);

  @Property({ nullable: true })
  social_facebook?: string;
  @Property({ nullable: true })
  social_twitter?: string;
  @Property({ nullable: true })
  social_github?: string;
  @Property({ nullable: true })
  social_linkedin?: string;
  @Property({ nullable: true })
  social_youtube?: string;
  @Property({ nullable: true })
  social_instagram?: string;

  @OneToOne({
    entity: () => User,
  })
  public direction!: User;

  @OneToOne({
    entity: () => User,
  })
  public admin_contact!: User;

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
