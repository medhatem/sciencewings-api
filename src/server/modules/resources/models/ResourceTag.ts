import { container, provide } from '@/di';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
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

  @ManyToOne({
    entity: () => Organization,
    nullable: true,
  })
  public organization?: Organization;
}
