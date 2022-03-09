import { Entity, ManyToOne, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
import { Bank } from '@/modules/organizations/models/Bank';
import { Currency } from '@/modules/organizations/models/Currency';
import { Partner } from '@/modules/organizations/models/Partner';

@provideSingleton()
@Entity()
@Unique({ name: 'partner_bank_unique_number', properties: ['sanitizedAccNumber', 'organization'] })
export class PartnerBank extends BaseModel<PartnerBank> {
  constructor() {
    super();
  }

  static getInstance(): PartnerBank {
    return container.get(PartnerBank);
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

  @ManyToOne({ entity: () => Partner, onDelete: 'cascade', index: 'partner_bank_partner_id_index' })
  partner!: Partner;

  @ManyToOne({ entity: () => Bank, onDelete: 'set null', nullable: true })
  bank?: Bank;

  @Property({ nullable: true })
  sequence?: number;

  @ManyToOne({ entity: () => Currency, onDelete: 'set null', nullable: true })
  currency?: Currency;

  @OneToOne({ entity: () => Organization, onDelete: 'cascade', nullable: true })
  organization?: Organization;
}
