import { Entity, OneToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Member } from '@/modules/hr/models/Member';
import { Project } from '@/modules/projects/models/Project';

export enum ProjectMemberStatus {
  ACTIVE = 'active',
  DESACTIVE = 'desactive',
}
export enum RolesList {
  MANAGER = 'manager',
  PARTICIPANT = 'participant',
  VIEWER = 'viewers',
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
  @OneToOne({
    entity: () => Project,
    primary: true,
    unique: false,
  })
  project!: Project;

  @OneToOne({
    entity: () => Member,
    primary: true,
    unique: false,
  })
  member!: Member;

  [PrimaryKeyType]?: [Project, Member];

  @Property()
  role?: RolesList;

  @Property()
  status: ProjectMemberStatus;
}
