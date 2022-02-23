import { Member } from '@/modules/hr/models/Member';
import { Entity, ManyToOne, Property, Collection, OneToMany } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '../../base/models/BaseModel';
import { Organization } from '../../organizations/models/Organization';
import { User } from '../../users/models/User';
import { ProjectTag } from './ProjetcTag';
import { ProjectTask } from './ProjetcTask';

// import { ResPartner } from '../../organisations/models/ResPartner';

@provideSingleton()
@Entity()
export class Project extends BaseModel<Project> {
  constructor() {
    super();
  }

  static getInstance(): Project {
    return container.get(Project);
  }

  @Property()
  title: string;

  @Property()
  description: string;

  @ManyToOne({ entity: () => Member, nullable: true })
  responsibles: Member;

  @ManyToOne({ entity: () => Member, nullable: true })
  participants: Member;

  @Property()
  active: boolean;

  @Property()
  date_start: Date;

  @Property({ nullable: true })
  date_end?: Date;

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

  // FK Organization
}
