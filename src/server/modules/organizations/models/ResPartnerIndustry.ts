import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@/di/index';

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
