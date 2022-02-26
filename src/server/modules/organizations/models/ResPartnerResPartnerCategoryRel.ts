import { Entity, Index, ManyToOne } from '@mikro-orm/core';

import { ResPartner } from '@/modules/organizations/models/ResPartner';
import { ResPartnerCategory } from '@/modules/organizations/models/ResPartnerCategory';
import { provideSingleton } from '@/di/index';

@provideSingleton()
@Entity()
@Index({ name: 'res_partner_res_partner_category_rel_partner_id_category_id_idx', properties: ['category', 'partner'] })
export class ResPartnerResPartnerCategoryRel {
  @ManyToOne({ entity: () => ResPartnerCategory, onDelete: 'cascade', primary: true })
  category!: ResPartnerCategory;

  @ManyToOne({ entity: () => ResPartner, onDelete: 'cascade', primary: true })
  partner!: ResPartner;
}
