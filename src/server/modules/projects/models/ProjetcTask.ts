import { Entity, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Member } from '@/modules/hr/models/Member';
import { Project } from './Project';

@provide()
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
