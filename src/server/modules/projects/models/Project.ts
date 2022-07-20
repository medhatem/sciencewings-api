import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Member } from '@/modules/hr/models/Member';
import { Organization } from '@/modules/organizations/models/Organization';
import { ProjectBoard } from './ProjectBoard';
import { ProjectTag } from './ProjectTag';
import { ProjectTask } from './ProjectTask';

@provide()
@Entity()
export class Project extends BaseModel<Project> {
  constructor() {
    super();
  }

  static getInstance(): Project {
    return container.get(Project);
  }

  @PrimaryKey()
  id?: number;

  @Property()
  title: string;

  @Property()
  description: string;

  @ManyToMany({ entity: () => Member, owner: true })
  managers = new Collection<Member>(this);

  @ManyToMany({ entity: () => Member, owner: true })
  participants = new Collection<Member>(this);

  @Property()
  active: boolean;

  @Property()
  dateStart: Date;

  @Property({ nullable: true })
  dateEnd?: Date;

  @OneToMany({
    entity: () => ProjectTag,
    mappedBy: (entity) => entity.project,
  })
  public projectTags? = new Collection<ProjectTag>(this);

  @OneToMany({
    entity: () => ProjectTask,
    mappedBy: (entity) => entity.project,
  })
  public projectTasks? = new Collection<ProjectTask>(this);

  @OneToMany({
    entity: () => ProjectBoard,
    mappedBy: (entity) => entity.project,
  })
  public projectBoard? = new Collection<ProjectBoard>(this);

  @ManyToOne({ entity: () => Organization, nullable: true, onDelete: 'cascade' })
  organization?: Organization;
}
