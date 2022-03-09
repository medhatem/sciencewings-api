import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';

@provideSingleton()
@Entity()
export class PartnerTitle extends BaseModel<PartnerTitle> {
  constructor() {
    super();
  }

  static getInstance(): PartnerTitle {
    return container.get(PartnerTitle);
  }
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  shortcut?: string;
}
