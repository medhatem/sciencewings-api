import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
// import { BaseModel } from './BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class ResLang {
  constructor() {
    // super();
  }

  static getInstance(): ResLang {
    return container.get(ResLang);
  }
  @PrimaryKey()
  id!: number;

  @Unique({ name: 'res_lang_name_uniq' })
  @Property()
  name!: string;

  @Unique({ name: 'res_lang_code_uniq' })
  @Property()
  code!: string;

  @Property({ nullable: true })
  isoCode?: string;

  @Unique({ name: 'res_lang_url_code_uniq' })
  @Property()
  urlCode!: string;

  @Property({ nullable: true })
  active?: boolean;

  @Property()
  direction!: string;

  @Property()
  dateFormat!: string;

  @Property()
  timeFormat!: string;

  @Property()
  weekStart!: string;

  @Property()
  grouping!: string;

  @Property()
  decimalPoint!: string;

  @Property({ nullable: true })
  thousandsSep?: string;
}
