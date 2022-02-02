import { PrimaryKey, Property, wrap } from '@mikro-orm/core';

import { provideSingleton } from '@di/index';

@provideSingleton()
export class BaseModel<T = any> {
  static getInstance(): void {
    throw new Error('The base model class cannot be instanciated and needs to be overriden!');
  }
  @PrimaryKey()
  id!: number;

  @Property({ columnType: 'timestamp', length: 6, nullable: true, onUpdate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ columnType: 'timestamp', length: 6, nullable: true, onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  /**
   *
   * @param strict
   * @param strip
   * @param args
   */
  toJSON(strict = true, strip = ['id', 'email'], ...args: any[]): { [p: string]: any } {
    const o = wrap(this, true).toObject(...args); // do not forget to pass rest params here

    if (strict) {
      strip.forEach((k) => delete o[k]);
    }

    return o;
  }
}
