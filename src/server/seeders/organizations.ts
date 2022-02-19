import { Address } from '@/modules/address/models/AdressModel';
import { AddressDao } from '@/modules/address/daos/AddressDAO';
import { AddressType } from '@/modules/address/models/AdressModel';
import { Organization } from '@/modules/organizations/models/Organization';
import { OrganizationDao } from '@/modules/organizations/daos/OrganizationDao';
import { OrganizationLabelDao } from '@/modules/organizations/daos/OrganizationLabelDao';
import { Phone } from '@/modules/phones/models/Phone';
import { PhoneDao } from '@/modules/phones/daos/PhoneDAO';
import { connection } from '../db/index';
import { faker } from '@faker-js/faker';
import { provideSingleton } from '../di';
import { wrap } from '@mikro-orm/core';

@provideSingleton()
export class SeedOrganizations {
  constructor(
    private dao: OrganizationDao,
    private addressDAO: AddressDao,
    private phoneDAO: PhoneDao,
    private labelDAO: OrganizationLabelDao,
  ) {}

  async createOgranizations(users: any) {
    const repository = connection.em.getRepository(Organization as any);
    await Promise.all(
      users.map(async (user: any) => {
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
        const phone = await this.phoneDAO.create(
          wrap(new Phone()).assign({
            label: 'personal',
            code: '+213',
            number: faker.phone.phoneNumberFormat(3),
          }),
        );
        const org: any = {
          name: faker.company.companyName(),
          email: faker.internet.email(),
          type: 'Public',
        };

        org.phone = phone;
        org.direction = user;
        org.admin_contact = user;
        org.address = [address];
        org.labels = [address];

        const organization: any = repository.create(org);
        repository.persist(organization);
        return organization;
      }),
    );

    await repository.flush();

    return await this.dao.getAll();
  }

  async createLabels(organizations: any) {
    await Promise.all(
      organizations.map(async (organization: any) => {
        await this.labelDAO.create({ name: faker.company.bsNoun(), organization: organization.id });
      }),
    );
    return await this.dao.getAll();
  }
}

// export const updateUsers = () => {};
