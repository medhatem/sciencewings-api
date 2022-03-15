import { container, provide } from '@/di';
import { BaseModel } from '@/modules/base';
import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
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

  @Unique()
  @Property()
  title!: string;

  @ManyToOne({
    entity: () => Resource,
    onDelete: 'cascade',
    nullable: true,
  })
  resource: Resource;
}
