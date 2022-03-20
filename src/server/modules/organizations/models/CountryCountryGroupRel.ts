import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { Country } from '@/modules/organizations/models/Country';
import { CountryGroup } from '@/modules/organizations/models/CountryGroup';
import { provide } from '@/di/index';

@provide()
@Entity()
@Index({
  name: 'res_country_res_country_group_res_country_group_id_res_coun_idx',
  properties: ['resCountry', 'resCountryGroup'],
})
export class CountryCountryGroupRel {
  @ManyToOne({ entity: () => Country, onDelete: 'cascade', primary: true })
  resCountry!: Country;

  @ManyToOne({ entity: () => CountryGroup, onDelete: 'cascade', primary: true })
  resCountryGroup!: CountryGroup;
}
