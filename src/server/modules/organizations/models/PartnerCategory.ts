import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';

@provideSingleton()
@Entity()
export class PartnerCategory extends BaseModel<PartnerCategory> {
  constructor() {
    super();
  }

  static getInstance(): PartnerCategory {
    return container.get(PartnerCategory);
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @ManyToOne({
    entity: () => PartnerCategory,
    onDelete: 'cascade',
    nullable: true,
    index: 'partner_category_parent_id_index',
  })
  parent?: PartnerCategory;

  @Property({ nullable: true })
  active?: boolean;

  @Index({ name: 'partner_category_parent_path_index' })
  @Property({ nullable: true })
  parentPath?: string;
}
