import { Address, AddressType } from '@/modules/address/models/AdressModel';

import { AddressDao } from '@/modules/address/daos/AddressDAO';
import { Logger } from '@/utils/Logger';
import { Member } from '@/modules/hr/models/Member';
import { Phone } from '@/modules/phones/models/Phone';
import { PhoneDao } from '@/modules/phones/daos/PhoneDAO';
import { applyToAll } from '@/utils/utilities';
import { connection } from '../db/index';
import { faker } from '@faker-js/faker';
import { provideSingleton } from '@/di';
import { wrap } from '@mikro-orm/core';

/**
 * create member
 * by making for each one { Address, Phone }
 * and assing an organizations, resource to it
 */
@provideSingleton()
export class SeedMembers {
  constructor(private phoneDAO: PhoneDao, private addressDAO: AddressDao, private logger: Logger) {}

  async createMembersForOrganization(organizations: any, resources: any): Promise<any> {
    try {
      const repository = connection.em.getRepository(Member as any);
      await applyToAll(organizations, async (org: any, idx: number) => {
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
            apartment: faker.datatype.number(),
            city: faker.address.city(),
          }),
        );

        const member = {
          resource: resources[idx],
          organization: organizations[idx],
          name: faker.name.findName(),
          active: true,
          jobTitle: faker.name.jobTitle(),
          address: address,
          workPhone: phone,
          memberType: 'regular',
        };

        const createdMember: any = repository.create(member);
        repository.persist(createdMember);
        return createdMember;
      });

      await repository.flush();
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}
