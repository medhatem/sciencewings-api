import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
import { ProjectBoard } from '@/modules/projects/models/ProjectBoard';
import { ProjectTag } from '@/modules/projects/models/ProjectTag';
import { ProjectTask } from '@/modules/projects/models/ProjectTask';
import { ProjectMember } from '@/modules/projects/models/ProjectMember';
import { Member } from '@/modules/hr/models/Member';
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
  id: number;

  @Property()
  title: string;

  @Unique()
  @Property()
  key: string;

  @Property()
  description: string;

  @ManyToMany({ entity: () => Member, owner: true, pivotEntity: () => ProjectMember })
  members = new Collection<Member>(this);

  @Property()
  active: boolean;

  @Property()
  dateStart: Date;

  @Property({ nullable: true })
  dateEnd: Date;

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

  @ManyToOne({ entity: () => Organization, nullable: false, onDelete: 'cascade' })
  organization: Organization;

  // @ManyToMany({ entity: () => ProjectMember, pivotEntity: () => ProjectMember })
  // projectMember? = new Collection<ProjectMember>(this);
}
