import { Address, AddressType } from './../modules/address/models/AdressModel';

import { AddressDao } from './../modules/address/daos/AddressDAO';
import { Member } from '../modules/hr/models/Member';
import { Phone } from '../modules/phones/models/Phone';
import { PhoneDao } from '../modules/phones/daos/PhoneDAO';
import { connection } from '../db/index';
import { faker } from '@faker-js/faker';
import { provideSingleton } from '../di';
import { wrap } from '@mikro-orm/core';

@provideSingleton()
export class SeedMembers {
  constructor(private phoneDAO: PhoneDao, private addressDAO: AddressDao) {}

  async createMembers(organizations: any, resources: any): Promise<any> {
    const repository = connection.em.getRepository(Member as any);
    let idx = 0;
    await Promise.all(
      organizations.map(async () => {
        const phone = await this.phoneDAO.create(
          wrap(new Phone()).assign({
            label: 'personal',
            code: '+213',
            number: faker.phone.phoneNumberFormat(3),
          }),
        );
        const address = await this.addressDAO.create(
          wrap(new Address()).assign({
            country: faker.address.country(),
            province: faker.address.state(),
            code: faker.address.countryCode(),
            type: AddressType.ORGANIZATION,
            street: faker.address.streetAddress(),
            appartement: faker.datatype.number().toString(),
            city: faker.address.city(),
          }),
        );

        const _member = {
          resource: resources[idx],
          organization: organizations[idx],
          name: faker.name.findName(),
          active: true,
          jobTitle: faker.name.jobTitle(),
          address: address,
          workPhone: phone,
          memberType: 'regular',
        };

        const member: any = repository.create(_member);
        repository.persist(member);
        idx++;
        return member;
      }),
    );

    await repository.flush();
  }
}
