import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { ProjectBoard } from './ProjectBoard';
import { ProjectTask } from './ProjectTask';

// export enum Priority {
//   Lowest,
//   Low,
//   Medium,
//   High,
//   Highest,
// }
@provide()
@Entity()
export class TasksList extends BaseModel<TasksList> {
  constructor() {
    super();
  }

  static getInstance(): TasksList {
    return container.get(TasksList);
  }

  @PrimaryKey()
  id?: number;

  @Property()
  name: string;

  @Property()
  description: string;

  @ManyToOne({
    entity: () => ProjectBoard,
    onDelete: 'cascade',
    nullable: true,
    eager: false,
  })
  tasksList: ProjectBoard;

  @OneToMany({
    entity: () => ProjectTask,
    mappedBy: (entity) => entity.project,
  })
  public projectTask? = new Collection<ProjectTask>(this);
}
