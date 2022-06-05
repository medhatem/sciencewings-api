import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Project } from './Project';

@provide()
@Entity()
export class ProjectTag extends BaseModel<ProjectTag> {
  constructor() {
    super();
  }

  static getInstance(): ProjectTag {
    return container.get(ProjectTag);
  }

  @PrimaryKey()
  id?: number;

  @Property()
  title: string;

  @ManyToOne({
    entity: () => Project,
    onDelete: 'cascade',
    nullable: true,
  })
  project: Project;
}
