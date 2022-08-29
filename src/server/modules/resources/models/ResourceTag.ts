import { container, provide } from '@/di';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core';
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

  @PrimaryKey()
  id: number;

  @Property()
  title!: string;

  @ManyToMany({
    entity: () => Resource,
  })
  resource = new Collection<Resource>(this);
}
