import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Member } from '@/modules/hr/models/Member';
import { ProjectTask } from './ProjectTask';

export enum Priority {
  Lowest,
  Low,
  Medium,
  High,
  Highest,
}

@provide()
@Entity()
export class Comment extends BaseModel<Comment> {
  constructor() {
    super();
  }

  static getInstance(): Comment {
    return container.get(Comment);
  }

  @PrimaryKey()
  id?: number;

  @Property()
  content: string;

  @OneToOne({ entity: () => Member, nullable: true })
  createdBy: Member;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date;

  @ManyToOne({
    entity: () => ProjectTask,
    onDelete: 'cascade',
    nullable: true,
    eager: false,
  })
  task: ProjectTask;
}
