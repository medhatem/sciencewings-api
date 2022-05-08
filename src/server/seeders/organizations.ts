import { Address } from '@/modules/address/models/Address';
import { AddressDao } from '@/modules/address/daos/AddressDAO';
import { AddressType } from '@/modules/address/models/Address';
import { Logger } from '@/utils/Logger';
import { Organization } from '@/modules/organizations/models/Organization';
import { OrganizationDao } from '@/modules/organizations/daos/OrganizationDao';
import { OrganizationLabelDao } from '@/modules/organizations/daos/OrganizationLabelDao';
import { Phone } from '@/modules/phones/models/Phone';
import { PhoneDao } from '@/modules/phones/daos/PhoneDAO';
import { applyToAll } from '@/utils/utilities';
import { connection } from '../db/index';
import { faker } from '@faker-js/faker';
import { provideSingleton } from '@/di';
import { wrap } from '@mikro-orm/core';

/**
 * create organizations
 * by making for each one { Address, Phone, Labels }
 * and assing a user to it
 */
@provideSingleton()
export class SeedOrganizations {
  constructor(
    private dao: OrganizationDao,
    private addressDAO: AddressDao,
    private phoneDAO: PhoneDao,
    private labelDAO: OrganizationLabelDao,
    private logger: Logger,
  ) {}

  async createOgranizations(users: any) {
    try {
      const repository = connection.em.getRepository(Organization as any);
      await applyToAll(users, async (user: any) => {
        const address = await this.addressDAO.create(
          wrap(new Address()).assign({
            country: faker.address.country(),
            province: faker.address.state(),
            code: faker.address.countryCode(),
            type: AddressType.ORGANIZATION,
            street: faker.address.streetAddress(),
            apartment: faker.datatype.number().toString(),
            city: faker.address.city(),
          }),
        );
        const phone = await this.phoneDAO.create(
          wrap(new Phone()).assign({
            phoneLabel: 'personal',
            phoneCode: '+213',
            phoneNumber: faker.phone.phoneNumberFormat(3),
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
      });

      await repository.flush();

      return await this.dao.getAll();
    } catch (error) {
      Logger.getInstance().error(error);
      return null;
    }
  }

  async createLabels(organizations: any) {
    try {
      await applyToAll(organizations, async (organization: any) => {
        await this.labelDAO.create({ name: faker.company.bsNoun(), organization: organization.id });
      });

      return await this.dao.getAll();
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}

// export const updateUsers = () => {};
