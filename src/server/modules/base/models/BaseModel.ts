import { PrimaryKey, Property } from '@mikro-orm/core';

import { provideSingleton } from '@/di/index';

/**
 * Every model that inherates from this BaseModel
 * needs to be instanciated  with provide (None Singleton scope)
 * so it can be a thread safe for mikro-orm tasks
 */
@provideSingleton()
export class BaseModel<T = any> {
  static getInstance(): void {
    throw new Error('The base model class cannot be instanciated and needs to be overriden!');
  }

  @PrimaryKey()
  id?: number;

  @Property({ columnType: 'timestamp', length: 6, nullable: true, onUpdate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ columnType: 'timestamp', length: 6, nullable: true, onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
