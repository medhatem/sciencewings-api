import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { Organisation } from '../../organisations/models/Organisation';
import { ResPartner } from '../../organisations/models/ResPartner';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class HrWorkLocation extends BaseModel<HrWorkLocation> {
  constructor() {
    super();
  }

  static getInstance(): HrWorkLocation {
    return container.get(HrWorkLocation);
  }

  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  active?: boolean;

  @Property()
  name!: string;

  @ManyToOne({ entity: () => Organisation })
  organisation!: Organisation;

  @ManyToOne({ entity: () => ResPartner })
  address!: ResPartner;

  @Property({ nullable: true })
  locationNumber?: string;
}
