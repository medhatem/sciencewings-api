import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';

@provideSingleton()
@Entity()
export class ContractType extends BaseModel<ContractType> {
  constructor() {
    super();
  }

  static getInstance(): ContractType {
    return container.get(ContractType);
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;
}
