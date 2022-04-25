import intern from 'intern';
import { stub, createStubInstance } from 'sinon';
const { suite, test } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { AddressService } from '@/modules/address/services/AddressService';
import { before } from 'intern/lib/interfaces/tdd';
import { Result } from '@/utils/Result';
import { OrganizationDao } from '@/modules/organizations/daos/OrganizationDao';
import { UserService } from '@/modules/users/services/UserService';
import { applyToAll } from '@/utils/utilities';
import { PhoneService } from '@/modules/phones/services/PhoneService';
import { OrganisationLabelService } from '@/modules/organizations/services/OrganizationLabelService';
import { BaseService } from '@/modules/base';
import { Organization, OrganizationType } from '@/modules/organizations/models/Organization';
import { AddressType } from '@/modules/address/models/Address';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  const baseService: BaseService<Organization> = createStubInstance(BaseService);
  const organizationDAO = createStubInstance(OrganizationDao);

  const userService = createStubInstance(UserService);
  const addressService = createStubInstance(AddressService);
  const phoneService = createStubInstance(PhoneService);
  const labelService = createStubInstance(OrganisationLabelService);

  before(() => {
    stub(userService, 'get')
      .withArgs(1)
      .returns(Promise.resolve(Result.ok({ id: 1 })));
    stub(addressService, 'create').returns(Promise.resolve(Result.ok({ id: 1 })));
    stub(phoneService, 'create').returns(Promise.resolve(Result.ok({ id: 1 })));
    stub(labelService, 'createBulkLabel').returns(Promise.resolve(Result.ok(200)));
    stub(baseService, 'getByCriteria').withArgs({ name: 'testingground2' }).returns(Promise.resolve(null));
  });

  test('should create the organization', async () => {
    const userId = 1;
    const payload = {
      name: 'testingground2',
      email: 'testingground1@gmail.com',
      phones: [
        {
          phoneLabel: 'personal',
          phoneCode: '+213',
          phoneNumber: '541110222',
        },
      ],
      type: 'Public',
      labels: ['x', 'y', 'z'],
      members: [] as any,
      social: [] as any,
      direction: 1,
      adminContact: 1,
      addresses: [
        {
          country: 'Canada',
          province: 'Ontario',
          code: '5L8 G9S',
          type: 'ORGANIZATION',
          street: '487 Yardley Cres',
          appartement: '12',
          city: 'Ontario',
        },
      ],
    };

    // check if the organization already exist
    const existingOrg = await baseService.getByCriteria({ name: payload.name });
    if (existingOrg) {
      expect.fail('Should not find the Organization by name');
      // return Result.fail(`Organization ${payload.name} already exist.`);
    }

    const fetchedUser = await userService.get(userId);
    if (fetchedUser.isFailure || fetchedUser.getValue() === null) {
      expect.fail('Should find the user by id');
      // return Result.notFound(`User with id: ${userId} does not exist`);
    }
    const user = fetchedUser.getValue();

    let adminContact;
    if (payload.adminContact) {
      adminContact = await userService.get(payload.adminContact);
      if (adminContact.isFailure || adminContact.getValue() === null) {
        expect.fail('Should find the user by id');
        // return Result.notFound(`User with id: ${payload.adminContact} does not exist.`);
      }
    }

    let direction;
    if (payload.direction) {
      direction = await userService.get(payload.direction);
      if (direction.isFailure || direction.getValue() === null) {
        expect.fail('Should find the user by id');
        // return Result.notFound(`User with id: ${payload.direction} does not exist.`);
      }
    }

    stub(baseService, 'wrapEntity').returns({
      name: payload.name,
      email: payload.email,
      type: OrganizationType.PUBLIC,
      description: '',
      phones: undefined,
      address: undefined,
      direction: direction.getValue(),
      admin_contact: adminContact.getValue(),
    });
    const wrappedOrganization = baseService.wrapEntity(
      organizationDAO.model,
      {
        name: payload.name,
        email: payload.email,
        type: payload.type,
        owner: user,
      },
      false,
    );

    stub(organizationDAO, 'create').returns(Promise.resolve({ id: 1, ...wrappedOrganization }));

    const organization = await organizationDAO.create(wrappedOrganization);

    await applyToAll(payload.addresses, async (address) => {
      await addressService.create({
        city: address.city,
        country: address.country,
        code: address.code,
        province: address.province,
        street: address.street,
        type: AddressType.ORGANIZATION,
        organization,
      });
    });
    await applyToAll(payload.phones, async (phone) => {
      await phoneService.create({
        phoneLabel: phone.phoneLabel,
        phoneCode: phone.phoneCode,
        phoneNumber: phone.phoneNumber,
        organization,
      });
    });

    if (payload.labels?.length) {
      await labelService.createBulkLabel(payload.labels, organization);
    }

    expect(organization.id).equal(1);
  });
});
