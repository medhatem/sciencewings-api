import { PrimaryKey, Property, wrap, Entity } from '@mikro-orm/core';

import { provideSingleton } from '@di/index';

// id, street, province, country, code, type

// interface CoordType {
//   lat: number;
//   long: number;
// }

interface OrganizationAdressType {
  billing: string;
  shipping: string;
}

interface UserAdressType {
  shipping: string;
}

interface ResourceAdressType {
  location: string;
}

type AdressType = OrganizationAdressType | UserAdressType | ResourceAdressType;

@provideSingleton()
@Entity()
export class Adress {
  static getInstance(): void {
    throw new Error('The base model class cannot be instanciated and needs to be overriden!');
  }

  @PrimaryKey()
  id!: number;

  @Property()
  country: string;

  @Property()
  province: string;

  @Property()
  code: string;

  @Property()
  type: AdressType;

  /**
   *
   * @param strict
   * @param strip
   * @param args
   */
  toJSON(strict = true, strip = [''], ...args: any[]): { [p: string]: any } {
    const o = wrap(this, true).toObject(...args); // do not forget to pass rest params here

    if (strict) {
      strip.forEach((k) => delete o[k]);
    }

    return o;
  }
}
