import { Entity, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Member } from '@/modules/hr/models/Member';
import { Resource } from '@/modules/resources/models/Resource';

export enum ResourceRolesList {
  RESPONSIBLE = 'responsible',
}

@provide()
@Entity()
export class ResourceManager extends BaseModel<ResourceManager> {
  constructor() {
    super();
  }

  static getInstance(): ResourceManager {
    return container.get(ResourceManager);
  }
  @ManyToOne({
    entity: () => Resource,
    primary: true,
    unique: false,
  })
  resource!: Resource;

  @ManyToOne({
    entity: () => Member,
    primary: true,
    unique: false,
  })
  member!: Member;

  [PrimaryKeyType]?: [Resource, Member];

  @Property()
  role: ResourceRolesList;
}
