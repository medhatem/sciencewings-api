import { Project } from './Project';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '../../base/models/BaseModel';

@provideSingleton()
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
