import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';

@provideSingleton()
@Entity()
export class ResPartnerTitle extends BaseModel<ResPartnerTitle> {
  constructor() {
    super();
  }

  static getInstance(): ResPartnerTitle {
    return container.get(ResPartnerTitle);
  }
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  shortcut?: string;
}
