import { Collection, DateType, Entity, Index, LoadStrategy, OneToMany, Property, Unique } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { Address } from '@/modules/address';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Phone } from '@/modules/phones/models/Phone';

@provideSingleton()
@Entity()
export class User extends BaseModel<User> {
  user: any;
  constructor() {
    super();
  }

  static getInstance(): User {
    return container.get(User);
  }
  @Property()
  firstname: string;

  @Property()
  lastname: string;

  @Property()
  @Unique()
  email: string;

  @OneToMany({
    entity: () => Address,
    mappedBy: (entity) => entity.user,
    nullable: true,
  })
  address? = new Collection<Address>(this);

  @OneToMany({
    entity: () => Phone,
    mappedBy: (entity) => entity.user,
  })
  phone? = new Collection<Phone>(this);

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

  // @Property()
  // notificationType!: string;
}
