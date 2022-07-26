import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { ProjectMember } from '@/modules/projects/models/projectMember';

export enum RolesList {
  MANAGER = 'manager',
  PARTICIPANT = 'participant',
  VIEWER = 'viewers',
}

@provide()
@Entity()
export class ProjectRole extends BaseModel<ProjectRole> {
  constructor() {
    super();
  }

  static getInstance(): ProjectRole {
    return container.get(ProjectRole);
  }
  @PrimaryKey()
  id?: number;

  @OneToOne({ entity: () => ProjectMember, nullable: true })
  projectMember: ProjectMember;

  @Property()
  role: RolesList;
}
