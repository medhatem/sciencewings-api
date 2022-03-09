import { Entity, Index, ManyToOne } from '@mikro-orm/core';

import { Partner } from '@/modules/organizations/models/Partner';
import { PartnerCategory } from '@/modules/organizations/models/PartnerCategory';
import { provideSingleton } from '@/di/index';

@provideSingleton()
@Entity()
@Index({ name: 'partner_partner_category_rel_partner_id_category_id_idx', properties: ['category', 'partner'] })
export class PartnerPartnerCategoryRel {
  @ManyToOne({ entity: () => PartnerCategory, onDelete: 'cascade', primary: true })
  category!: PartnerCategory;

  @ManyToOne({ entity: () => Partner, onDelete: 'cascade', primary: true })
  partner!: Partner;
}
