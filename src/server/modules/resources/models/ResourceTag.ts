import { container, provide } from '@/di';
import { BaseModel } from '@/modules/base';
import { Entity, ManyToMany, Property } from '@mikro-orm/core';
import { Resource } from './Resource';

@provide()
@Entity()
export class ResourceTag extends BaseModel<ResourceTag> {
  constructor() {
    super();
  }

  static getInstance(): ResourceTag {
    return container.get(ResourceTag);
  }

  @Property()
  title!: string;

  @ManyToMany({
    entity: () => Resource,
  })
  resource: Resource;
}
