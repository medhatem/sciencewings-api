import { Entity, ManyToOne, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
import { ResBank } from '@/modules/organizations/models/ResBank';
import { ResCurrency } from '@/modules/organizations/models/ResCurrency';
import { ResPartner } from '@/modules/organizations/models/ResPartner';

@provideSingleton()
@Entity()
@Unique({ name: 'res_partner_bank_unique_number', properties: ['sanitizedAccNumber', 'organization'] })
export class ResPartnerBank extends BaseModel<ResPartnerBank> {
  constructor() {
    super();
  }

  static getInstance(): ResPartnerBank {
    return container.get(ResPartnerBank);
  }

  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  active?: boolean;

  @Property()
  accNumber!: string;

  @Property({ nullable: true })
  sanitizedAccNumber?: string;

  @Property({ nullable: true })
  accHolderName?: string;

  @ManyToOne({ entity: () => ResPartner, onDelete: 'cascade', index: 'res_partner_bank_partner_id_index' })
  partner!: ResPartner;

  @ManyToOne({ entity: () => ResBank, onDelete: 'set null', nullable: true })
  bank?: ResBank;

  @Property({ nullable: true })
  sequence?: number;

  @ManyToOne({ entity: () => ResCurrency, onDelete: 'set null', nullable: true })
  currency?: ResCurrency;

  @OneToOne({ entity: () => Organization, onDelete: 'cascade', nullable: true })
  organization?: Organization;
}
