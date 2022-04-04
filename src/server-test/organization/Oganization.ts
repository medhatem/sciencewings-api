import { Configuration } from './../../server/configuration/Configuration';
import intern from 'intern';
import { SinonStubbedInstance, createStubInstance, restore, stub } from 'sinon';
const { suite, test, before, beforeEach, afterEach } = intern.getPlugin('interface.tdd');
const { expect } = intern.getPlugin('chai');
import { Organization } from '@/modules/organizations/models/Organization';
import { OrganizationService } from '@/modules/organizations/services/OrganizationService';
import { CreateOrganizationRO } from '@/modules/organizations/routes/RequestObject';
import { AddressType } from '@/modules/address';

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let organisationService: OrganizationService;
  before((): void => {
    Configuration.getInstance().init();
  });

  test('should create the organization', async () => {
    organisationService = createStubInstance<OrganizationService>(OrganizationService);
    const organization: CreateOrganizationRO = {
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
      direction: 1,
      adminContact: 1,
      addresses: [
        {
          country: 'Canada',
          province: 'Ontario',
          code: '5L8 G9S',
          type: AddressType.ORGANIZATION,
          street: '487 Yardley Cres',
          apartment: '12',
          city: 'Ontario',
        },
      ],
      description: '',
    };
    const result = await organisationService.createOrganization(organization, 1);
    expect(result.isSuccess).to.be.equal(true);
  });
});
