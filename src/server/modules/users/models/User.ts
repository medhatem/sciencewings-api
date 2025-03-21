import {
  Collection,
  DateType,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { Address } from '@/modules/address/models/Address';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Phone } from '@/modules/phones/models/Phone';
import { Reservation } from '@/modules/reservation/models/Reservation';

export enum userStatus {
  INVITATION_PENDING = 'INVITATION_PENDING',
  ACTIVE = 'ACTIVE',
}

@provide()
@Entity()
export class User extends BaseModel<User> {
  constructor() {
    super();
  }

  static getInstance(): User {
    return container.get(User);
  }

  @PrimaryKey()
  id?: number;

  @Property()
  firstname: string;

  @Property()
  lastname: string;

  @Property()
  @Unique()
  email: string;

  @OneToOne({ entity: () => Address, nullable: true })
  address: Address;

  @ManyToMany({
    entity: () => Phone,
    mappedBy: (entity: Phone) => entity.user,
    lazy: true,
    eager: false,
  })
  phones? = new Collection<Phone>(this);

  @Property({ type: DateType, nullable: true })
  dateofbirth = new Date();

  @Property()
  @Index()
  keycloakId: string;

  @Property({ columnType: 'text', nullable: true })
  signature?: string;

  @Property({ nullable: true })
  actionId?: number;

  @Property({ nullable: true })
  share?: boolean;

  @Property({ nullable: true })
  status?: userStatus;

  @OneToMany({ entity: () => Reservation, mappedBy: (r) => r.user, nullable: true })
  reservations? = new Collection<Reservation>(this);
}
