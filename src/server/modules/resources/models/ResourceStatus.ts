import { container, provide } from '@/di';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

export enum StatusCases {
  OPERATIONAL = 'operational',
  NON_OPERATIONAL = 'non-operational',
  MAJOR_REPAIR = 'major-repair',
  SOLD = 'sold',
}

@provide()
@Entity()
export class ResourceStatus extends BaseModel<ResourceStatus> {
  constructor() {
    super();
  }

  static getInstance(): ResourceStatus {
    return container.get(ResourceStatus);
  }

  @PrimaryKey()
  id: number;

  @Property()
  title: StatusCases;
}
