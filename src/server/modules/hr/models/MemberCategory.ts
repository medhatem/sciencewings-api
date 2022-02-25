import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@/di/index';

@provideSingleton()
@Entity()
export class MemberCategory extends BaseModel<MemberCategory> {
  constructor() {
    super();
  }

  static getInstance(): MemberCategory {
    return container.get(MemberCategory);
  }

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'hr_member_category_name_uniq' })
  @Property()
  name!: string;
}
