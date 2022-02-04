import { Collection, Entity, Index, ManyToMany, Property, Unique } from '@mikro-orm/core';
import { container, provideSingleton } from '@di/index';

import { BaseModel } from '../../base/models/BaseModel';
import { Organization } from '../../organisations/models/Organization';

// import { ResPartner } from '../../organisations/models/ResPartner';

@provideSingleton()
@Entity()
export class User extends BaseModel<User> {
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

  @Property()
  @Index()
  keycloakId: string;

  // @ManyToOne({ entity: () => Organisation })
  // @ManyToMany(() => Organisation, 'users', { owner: true })
  @ManyToMany(() => Organization, (organisation) => organisation.memebers)
  organisations = new Collection<Organization>(this);

  // @ManyToOne({ entity: () => ResPartner, index: 'res_users_partner_id_index' })
  // partner!: ResPartner;

  @Property({ columnType: 'text', nullable: true })
  signature?: string;

  @Property({ nullable: true })
  actionId?: number;

  @Property({ nullable: true })
  share?: boolean;

  // @Property()
  // notificationType!: string;
}
