import { Organization } from '@/modules/organizations/models/Organization';
import { Member } from '@/modules/hr/models/Member';
import { Entity, ManyToOne, Property, Collection, OneToMany, ManyToMany } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';
import { BaseModel } from '../../base/models/BaseModel';
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

  @ManyToMany({ entity: () => Member, owner: true })
  responsibles = new Collection<Member>(this);

  @ManyToMany({ entity: () => Member, owner: true })
  participants = new Collection<Member>(this);

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

  @ManyToOne({
    entity: () => Organization,
  })
  public organizations? = new Collection<Organization>(this);
}
