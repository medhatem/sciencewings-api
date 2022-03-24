import { Collection, DateType, Entity, Index, ManyToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { Address } from '@/modules/address';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Phone } from '@/modules/phones/models/Phone';

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

  @ManyToMany({
    entity: () => Address,
    mappedBy: (entity: Address) => entity.user,
    nullable: true,
  })
  address? = new Collection<Address>(this);

  @ManyToMany({
    entity: () => Phone,
    mappedBy: (entity: Phone) => entity.user,
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
}
