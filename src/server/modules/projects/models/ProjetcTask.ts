import { Project } from './Project';
import { Member } from '@/modules/hr/models/Member';
import { Entity, OneToOne, Property, ManyToOne } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '../../base/models/BaseModel';

@provideSingleton()
@Entity()
export class ProjectTask extends BaseModel<ProjectTask> {
  constructor() {
    super();
  }

  static getInstance(): ProjectTask {
    return container.get(ProjectTask);
  }

  @Property()
  title: string;

  @Property()
  description: string;

  @OneToOne({ entity: () => Member, nullable: true })
  assigned: Member;

  @Property()
  active: boolean;

  @Property()
  priority: string;

  @Property()
  date_start: Date;

  @Property({ nullable: true })
  date_end?: Date;

  @ManyToOne({
    entity: () => Project,
    onDelete: 'cascade',
    nullable: true,
  })
  project: Project;

  @ManyToOne({
    entity: () => ProjectTask,
    nullable: true,
  })
  public parent?: ProjectTask;
}
