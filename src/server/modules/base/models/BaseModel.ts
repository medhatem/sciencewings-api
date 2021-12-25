import { Property } from '@mikro-orm/core';

export class BaseModel<T = any> {
  static getInstance(): void {
    throw new Error('The base model class cannot be instanciated and needs to be overriden!');
  }

  @Property({ columnType: 'timestamp', length: 6, nullable: true, onUpdate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ columnType: 'timestamp', length: 6, nullable: true, onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
