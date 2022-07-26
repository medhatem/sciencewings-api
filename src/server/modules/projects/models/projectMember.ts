import { Entity, OneToMany, OneToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Member } from '@/modules/hr';
import { Project } from '@/modules/projects/models/Project';
import { ProjectRole } from '@/modules/projects/models/projectRole';

export enum ProjectMemberStatus {
  ACTIVE = 'active',
  DESACTIVE = 'desactive',
}

@provide()
@Entity()
export class ProjectMember extends BaseModel<ProjectMember> {
  constructor() {
    super();
  }

  static getInstance(): ProjectMember {
    return container.get(ProjectMember);
  }
  @OneToMany({
    entity: () => Project,
    mappedBy: (entity) => entity.projectMember,
    primary: true,
    unique: false,
  })
  project!: Project;

  @OneToMany({
    entity: () => Member,
    mappedBy: (entity) => entity.projectMember,
    primary: true,
    unique: false,
  })
  member!: Member;

  [PrimaryKeyType]?: [Member, Project];

  @OneToOne({ entity: () => ProjectRole, nullable: true })
  role: ProjectRole;

  @Property()
  status: ProjectMemberStatus;
}
