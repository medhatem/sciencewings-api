import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class ResPartnerCategory extends BaseModel<ResPartnerCategory> {
  constructor() {
    super();
  }

  static getInstance(): ResPartnerCategory {
    return container.get(ResPartnerCategory);
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  color?: number;

  @ManyToOne({
    entity: () => ResPartnerCategory,
    onDelete: 'cascade',
    nullable: true,
    index: 'res_partner_category_parent_id_index',
  })
  parent?: ResPartnerCategory;

  @Property({ nullable: true })
  active?: boolean;

  @Index({ name: 'res_partner_category_parent_path_index' })
  @Property({ nullable: true })
  parentPath?: string;
}
