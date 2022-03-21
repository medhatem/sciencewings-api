import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';

@provide()
@Entity()
export class MemberCategory extends BaseModel<MemberCategory> {
  constructor() {
    super();
  }

  static getInstance(): MemberCategory {
    return container.get(MemberCategory);
  }

  @PrimaryKey()
  id?: number;

  @Unique({ name: 'hr_member_category_name_uniq' })
  @Property()
  name!: string;
}
