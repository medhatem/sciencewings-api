import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
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

  @PrimaryKey()
  id?: number;

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
  dateStart: Date;

  @Property({ nullable: true })
  dateEnd?: Date;

  @ManyToOne({
    entity: () => Project,
    onDelete: 'cascade',
    nullable: true,
    eager: false,
  })
  project: Project;

  @ManyToOne({
    entity: () => ProjectTask,
    nullable: true,
  })
  public parent?: ProjectTask;
}
