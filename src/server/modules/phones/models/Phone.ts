import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '../../base/models/BaseModel';
import { Member } from '@/modules/hr/models/Member';
import { Organization } from '../../organizations/models/Organization';
import { User } from '@/modules/users/models/User';

// import { ResPartner } from '../../organisations/models/ResPartner';

@provideSingleton()
@Entity()
export class Phone extends BaseModel<Phone> {
  constructor() {
    super();
  }

  static getInstance(): Phone {
    return container.get(Phone);
  }
  @Property()
  label: string;

  @Property()
  code: string;

  @Property()
  number: string;

  @ManyToOne({ entity: () => User, nullable: true })
  user?: User;

  @ManyToOne({ entity: () => Organization, nullable: true })
  organization?: Organization;

  @ManyToOne({ entity: () => Member, nullable: true })
  member?: Member;
}
