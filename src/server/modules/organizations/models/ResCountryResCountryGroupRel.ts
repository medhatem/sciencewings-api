import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { ResCountry } from './ResCountry';
import { ResCountryGroup } from './ResCountryGroup';
import { provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
@Index({
  name: 'res_country_res_country_group_res_country_group_id_res_coun_idx',
  properties: ['resCountry', 'resCountryGroup'],
})
export class ResCountryResCountryGroupRel {
  @ManyToOne({ entity: () => ResCountry, onDelete: 'cascade', primary: true })
  resCountry!: ResCountry;

  @ManyToOne({ entity: () => ResCountryGroup, onDelete: 'cascade', primary: true })
  resCountryGroup!: ResCountryGroup;
}
