import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '@modules/base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

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
