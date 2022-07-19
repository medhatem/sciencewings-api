import { Entity, PrimaryKey } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';

@provide()
@Entity()
export class Infrastructure extends BaseModel<Infrastructure> {
  constructor() {
    super();
  }

  static getInstance(): Infrastructure {
    return container.get(Infrastructure);
  }

  @PrimaryKey()
  id?: number;
}
