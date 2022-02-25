import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@/di/index';

@provideSingleton()
@Entity()
@Unique({ name: 'res_groups_name_uniq', properties: ['name', 'categoryId'] })
export class ResGroups extends BaseModel<ResGroups> {
  constructor() {
    super();
  }

  static getInstance(): ResGroups {
    return container.get(ResGroups);
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ columnType: 'text', nullable: true })
  comment?: string;

  @Index({ name: 'res_groups_category_id_index' })
  @Property({ nullable: true })
  categoryId?: number;

  @Property({ nullable: true })
  share?: boolean;
}
