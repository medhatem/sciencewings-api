import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Member } from '@/modules/hr/models/Member';
import { TasksList } from '@/modules/projects/models/TasksList';
import { Project } from '@/modules/projects/models/Project';
import { Comment } from '@/modules/projects/models/Comment';

export enum Priority {
  Lowest,
  Low,
  Medium,
  High,
  Highest,
}

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
  createdBy: Member;

  @ManyToMany({
    entity: () => Member,
    mappedBy: (entity) => entity.task,
    lazy: true,
    eager: false,
  })
  public assigned = new Collection<Member>(this);

  @OneToOne({ entity: () => Member, nullable: true })
  reporter: Member;

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

  @ManyToOne({
    entity: () => TasksList,
    onDelete: 'cascade',
    nullable: true,
    eager: false,
  })
  projectTask: TasksList;

  @Property()
  completed: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date;

  @OneToMany({
    entity: () => ProjectTask,
    mappedBy: 'parent',
    lazy: true,
    eager: false,
  })
  public subTasks? = new Collection<ProjectTask>(this);

  @OneToMany({
    entity: () => Comment,
    mappedBy: (entity) => entity.task,
    lazy: true,
    eager: false,
  })
  public comments? = new Collection<Comment>(this);
}
