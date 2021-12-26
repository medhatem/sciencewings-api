import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { Organisation } from '../../organisations/models/Organisation';
import { ResPartner } from '../../organisations/models/ResPartner';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class User extends BaseModel<User> {
  constructor() {
    super();
  }

  static getInstance(): User {
    return container.get(User);
  }
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Organisation })
  organisation!: Organisation;

  @ManyToOne({ entity: () => ResPartner, index: 'res_users_partner_id_index' })
  partner!: ResPartner;

  @Property({ columnType: 'text', nullable: true })
  signature?: string;

  @Property({ nullable: true })
  actionId?: number;

  @Property({ nullable: true })
  share?: boolean;

  @Property()
  notificationType!: string;
}
