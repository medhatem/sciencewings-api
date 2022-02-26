import { Entity, ManyToOne, Property } from '@mikro-orm/core';
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

  @Property()
  title: string;

  @ManyToOne({
    entity: () => Project,
    onDelete: 'cascade',
    nullable: true,
  })
  project: Project;

  // FK Project
}
