import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';

@provideSingleton()
@Entity()
export class ResPartnerIndustry extends BaseModel<ResPartnerIndustry> {
  constructor() {
    super();
  }

  static getInstance(): ResPartnerIndustry {
    return container.get(ResPartnerIndustry);
  }
  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  name?: string;

  @Property({ nullable: true })
  fullName?: string;

  @Property({ nullable: true })
  active?: boolean;
}
