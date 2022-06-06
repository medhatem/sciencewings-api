import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Project } from './Project';
import { TasksList } from './TasksList';

@provide()
@Entity()
export class ProjectBoard extends BaseModel<ProjectBoard> {
  constructor() {
    super();
  }

  static getInstance(): ProjectBoard {
    return container.get(ProjectBoard);
  }

  @PrimaryKey()
  id?: number;

  @Property()
  name: string;

  @Property()
  slug: string;

  @ManyToOne({
    entity: () => Project,
  })
  public project? = new Collection<Project>(this);

  @OneToMany({
    entity: () => TasksList,
    mappedBy: (entity) => entity.tasksList,
  })
  public List? = new Collection<TasksList>(this);
}
