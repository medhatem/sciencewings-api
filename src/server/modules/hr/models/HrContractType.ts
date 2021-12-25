import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class HrContractType extends BaseModel<HrContractType> {
  constructor() {
    super();
  }

  static getInstance(): HrContractType {
    return container.get(HrContractType);
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;
}
