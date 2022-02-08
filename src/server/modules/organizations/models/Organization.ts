import { Address } from '../../base/models/AdressModel';
// import { OrganizationContact } from './OrganizationContact';
import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, Property, Unique } from '@mikro-orm/core';
import { container, provide } from '@di/index';
import { BaseModel } from '../../base/models/BaseModel';
import { User } from '@modules/users/models/User';
import { OrganizationLabel } from '@modules/organizations/models/OrganizationLabel';

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

  @Property()
  @Unique()
  phone!: string;

  // e.i: Public, Service, Institut
  @Property()
  type!: string;

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

  // @OneToMany({
  //   entity: () => OrganizationContact,
  //   mappedBy: (entity) => entity.organization,
  // })
  // public contacts? = new Collection<OrganizationContact>(this);

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
