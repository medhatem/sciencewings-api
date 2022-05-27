import { container, provide } from '@/di';
import { BaseModel } from '@/modules/base';
import { Member } from '@/modules/hr';
import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Resource } from './Resource';
import { ResourceStatus } from './ResourceStatus';

@provide()
@Entity()
export class ResourceStatusHistory extends BaseModel<ResourceStatusHistory> {
  constructor() {
    super();
  }

  static getInstance(): ResourceStatusHistory {
    return container.get(ResourceStatusHistory);
  }

  @PrimaryKey()
  id: number;

  @OneToOne({
    entity: () => Resource,
    nullable: true,
  })
  resource: Resource;

  @OneToOne({
    entity: () => Member,
    nullable: true,
  })
  member: Member;

  @OneToOne({ entity: () => ResourceStatus, onDelete: 'set null', nullable: true })
  statusType: ResourceStatus;

  @Property()
  statusDescription: string;
}
