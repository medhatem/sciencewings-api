import { container, provide } from '@/di';
import { BaseModel } from '@/modules/base';
import { Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Resource } from './Resource';

@provide()
@Entity()
export class ResourceRate extends BaseModel<ResourceRate> {
  constructor() {
    super();
  }

  static getInstance(): ResourceRate {
    return container.get(ResourceRate);
  }

  @PrimaryKey()
  id: number;

  @Property()
  description: string;

  @Property()
  rate: string;

  @Property()
  category: string;

  @Property()
  isPublic: boolean;

  @Property()
  isRequiredAccountNumber: boolean;

  @Property()
  duration: string;

  @ManyToMany({
    entity: () => Resource,
  })
  resource: Resource;
}
