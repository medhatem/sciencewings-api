import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '../../base/models/BaseModel';
import { Organization } from '../../organizations/models/Organization';
import { User } from '../../users/models/User';

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
  label: string;

  @Property()
  code: string;

  @Property()
  number: string;

  @ManyToOne({ entity: () => User, nullable: true })
  user?: User;

  @ManyToOne({ entity: () => Organization, nullable: true })
  organization?: Organization;
}
