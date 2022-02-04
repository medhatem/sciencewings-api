import { OrganizationContact } from './OrganizationContact';
import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property, Unique } from '@mikro-orm/core';
import { container, provide } from '@di/index';
import { BaseModel } from '../../base/models/BaseModel';
import { User } from '@modules/users/models/User';
import { OrganizationLabel } from '@modules/organisations/models/OrganizationLabel';
import { OrganizationSocial } from './OraganizationSocial';

@provide()
@Entity()
export class Organization extends BaseModel<Organization> {
  constructor() {
    super();
  }

  static getInstance(): Organization {
    return container.get(Organization);
  }
  @Unique({ name: 'res_organisation_name_uniq' })
  @Property()
  name!: string;

  @Property()
  @Unique()
  email!: string;

  @Property()
  @Unique()
  phone!: string;

  @Property()
  type!: string;

  @OneToMany({
    entity: () => OrganizationLabel,
    mappedBy: (entity) => entity.organisation,
  })
  public labels? = new Collection<OrganizationLabel>(this);

  @ManyToMany({ entity: () => User })
  memebers? = new Collection<User>(this);

  @OneToMany({
    entity: () => OrganizationSocial,
    mappedBy: (entity) => entity.organisation,
  })
  public contacts? = new Collection<OrganizationContact>(this);

  @OneToMany({
    entity: () => OrganizationSocial,
    mappedBy: (entity) => entity.organisation,
  })
  public social? = new Collection<OrganizationSocial>(this);

  // @OneToMany({
  //   entity: () => OrganizationContact,
  //   mappedBy: (entity) => entity.organisation,
  // })
  // public adminContacts? = new Collection<OrganizationContact>(this);

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
