import { CreateMemberRO, UpdateMemberRO } from '@/modules/hr/routes/RequestObject';
import { CreateMemberSchema, UpdateMemberSchema } from '@/modules/hr/schemas/MemberSchema';
import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { IAddressService } from '@/modules/address/interfaces/IAddressService';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { IOrganizationService } from '@/modules/organizations/interfaces';
import { IPhoneService } from '@/modules/phones/interfaces/IPhoneService';
import { IResourceService } from '@/modules/resources/interfaces';
import { Member } from '@/modules/hr/models/Member';
import { MemberDao } from '../daos/MemberDao';
import { Result } from '@/utils/Result';
import { log } from '@/modules/../decorators/log';
import { safeGuard } from '@/modules/../decorators/safeGuard';
import { validate } from '@/decorators/validate';
import { validateParam } from '@/decorators/validateParam';

type MemberRO = CreateMemberRO | UpdateMemberRO;
@provideSingleton(IMemberService)
export class MemberService extends BaseService<Member> implements IMemberService {
  constructor(
    public dao: MemberDao,
    public organizationService: IOrganizationService,
    public addressService: IAddressService,
    public phoneService: IPhoneService,
    public resourceService: IResourceService,
  ) {
    super(dao);
  }

  static getInstance(): IMemberService {
    return container.get(IMemberService);
  }

  @log()
  @safeGuard()
  private async checkEntitiesExistence(organization: number, resource: number): Promise<Result<any>> {
    let currentOrg, currentRes;
    if (organization) {
      currentOrg = await this.organizationService.get(organization);
      if (currentOrg.isFailure || currentOrg.getValue() === null) {
        return Result.fail<number>(`Organization with id ${organization} does not exist.`);
      }
    }
    if (resource) {
      currentRes = await this.resourceService.get(resource);
      if (currentRes.isFailure || currentRes.getValue() === null) {
        return Result.fail<number>(`Resource with id ${resource} does not exist.`);
      }
    }
    return Result.ok({ currentOrg, currentRes });
  }

  @log()
  @safeGuard()
  private async handleAddressForMemeber(payload: MemberRO, isUpdate = false): Promise<Result<any>> {
    let createdAddress, createdWorkLocation, createdAddressHome;

    if (isUpdate) {
      if (payload.address) {
        const fetchedAdress = await this.addressService.get(payload.address.id);
        if (fetchedAdress.isFailure) return Result.fail(fetchedAdress.error);
        const address = {
          ...fetchedAdress.getValue(),
          ...payload.address,
        };
        this.addressService.update(address);
      }
      if (payload.workLocation) {
        const fetchedWorkLocation = await this.addressService.get(payload.address.id);
        if (fetchedWorkLocation.isFailure) return Result.fail(fetchedWorkLocation.error);
        const workLocation = {
          ...fetchedWorkLocation.getValue(),
          ...payload.workLocation,
        };
        this.addressService.update(workLocation);
      }
      if (payload.addressHome) {
        const fetchedAddressHome = await this.addressService.get(payload.address.id);
        if (fetchedAddressHome.isFailure) return Result.fail(fetchedAddressHome.error);
        const addressHome = {
          ...fetchedAddressHome.getValue(),
          ...payload.addressHome,
        };
        this.addressService.update(addressHome);
      }
    }

    if (payload.address) createdAddress = await this.addressService.createAddress(payload.address);
    if (payload.workLocation) createdWorkLocation = await this.addressService.createAddress(payload.workLocation);
    if (payload.addressHome) createdAddressHome = await this.addressService.createAddress(payload.addressHome);

    if (payload.address) createdAddress = await this.addressService.createAddress(payload.address);
    if (payload.workLocation) createdWorkLocation = await this.addressService.createAddress(payload.workLocation);
    if (payload.addressHome) createdAddressHome = await this.addressService.createAddress(payload.addressHome);

    if (payload.address && createdAddress.isFailure) {
      return Result.fail<number>(createdAddress.error);
    } else if (payload.workLocation && createdWorkLocation.isFailure) {
      if (payload.address) await this.addressService.remove(createdAddress.getValue().id);
      return Result.fail<number>(createdWorkLocation.error);
    } else if (payload.addressHome && createdAddressHome.isFailure) {
      if (payload.address) await this.addressService.remove(createdAddress.getValue().id);
      if (payload.workLocation) await this.addressService.remove(createdWorkLocation.getValue().id);
      return Result.fail<number>(createdAddressHome.error);
    }

    const address = payload.address ? createdAddress.getValue() : null;
    const workLocation = payload.workLocation ? createdWorkLocation.getValue() : null;
    const addressHome = payload.addressHome ? createdAddressHome.getValue() : null;

    return Result.ok({ address, workLocation, addressHome });
  }

  @log()
  @safeGuard()
  private async handlePhonesForMemeber(payload: MemberRO, member: Member, isUpdate = false): Promise<Result<any>> {
    let createdWorkPhone, createdMobilePhone, createdEmergencyPhone;

    if (isUpdate) {
      if (payload.workPhone) {
        this.phoneService.remove(payload.workPhone.id);
      }
      if (payload.mobilePhone) {
        this.phoneService.remove(payload.mobilePhone.id);
      }
      if (payload.emergencyPhone) {
        this.phoneService.remove(payload.emergencyPhone.id);
      }
    }

    if (isUpdate) {
      if (payload.workPhone) {
        const fetchedWorkPhone = await this.phoneService.get(payload.workPhone.id);
        if (fetchedWorkPhone.isFailure) return Result.fail(fetchedWorkPhone.error);
        const workPhone = {
          ...fetchedWorkPhone.getValue(),
          ...payload.workPhone,
        };
        this.phoneService.update(workPhone);
      }
      if (payload.mobilePhone) {
        const fetchedMobilePhone = await this.phoneService.get(payload.address.id);
        if (fetchedMobilePhone.isFailure) return Result.fail(fetchedMobilePhone.error);
        const mobilePhone = {
          ...fetchedMobilePhone.getValue(),
          ...payload.mobilePhone,
        };
        this.phoneService.update(mobilePhone);
      }
      if (payload.emergencyPhone) {
        const fetchedEmergencyPhone = await this.phoneService.get(payload.address.id);
        if (fetchedEmergencyPhone.isFailure) return Result.fail(fetchedEmergencyPhone.error);
        const emergencyPhone = {
          ...fetchedEmergencyPhone.getValue(),
          ...payload.emergencyPhone,
        };
        this.phoneService.update(emergencyPhone);
      }
    }

    if (payload.workPhone) createdWorkPhone = await this.phoneService.createPhoneForMember(payload.workPhone, member);
    if (payload.mobilePhone)
      createdMobilePhone = await this.phoneService.createPhoneForMember(payload.mobilePhone, member);
    if (payload.emergencyPhone)
      createdEmergencyPhone = await this.phoneService.createPhoneForMember(payload.emergencyPhone, member);

    if (payload.workPhone && createdWorkPhone.isFailure) {
      return Result.fail<number>(createdWorkPhone.error);
    } else if (payload.mobilePhone && createdMobilePhone.isFailure) {
      await this.phoneService.remove(createdWorkPhone.getValue().id);
      return Result.fail<number>(createdMobilePhone.error);
    } else if (payload.emergencyPhone && createdEmergencyPhone.isFailure) {
      await this.phoneService.remove(createdWorkPhone.getValue().id);
      await this.phoneService.remove(createdMobilePhone.getValue().id);
      return Result.fail<number>(createdEmergencyPhone.error);
    }

    const workPhone = payload.workPhone ? createdWorkPhone.getValue() : null;
    const mobilePhone = payload.mobilePhone ? createdMobilePhone.getValue() : null;
    const emergencyPhone = payload.emergencyPhone ? createdEmergencyPhone.getValue() : null;

    return Result.ok({ workPhone, mobilePhone, emergencyPhone });
  }

  /**
   * Override the create method
   */
  @log()
  @safeGuard()
  @validate
  public async createMember(@validateParam(CreateMemberSchema) payload: MemberRO): Promise<Result<number>> {
    const existence = await this.checkEntitiesExistence(payload.organization, payload.resource);
    if (existence.isFailure) return Result.fail<number>(existence.error);
    const { currentOrg, currentRes } = await existence.getValue();

    const addresss = await this.handleAddressForMemeber(payload);
    if (addresss.isFailure) return Result.fail<number>(addresss.error);
    const { address, workLocation, addressHome } = await addresss.getValue();

    const member: Member = {
      id: null,
      ...payload,
      organization: currentOrg.getValue(),
      resource: currentRes.getValue(),
      address,
      workLocation,
      addressHome,
    };

    const createdMember = await this.create(member);

    if (createdMember.isFailure) {
      return Result.fail<number>(createdMember.error);
    }

    const phones = await this.handlePhonesForMemeber(payload, createdMember.getValue());
    if (phones.isFailure) {
      {
        return Result.fail<number>(existence.error);
      }
    }
    const { workPhone, mobilePhone, emergencyPhone } = await phones.getValue();
    member.workPhone = workPhone;
    member.mobilePhone = mobilePhone;
    member.emergencyPhone = emergencyPhone;
    await this.update(member);

    return Result.ok(createdMember.getValue().id);
  }

  /**
   * Override the update method
   */
  @log()
  @safeGuard()
  @validate
  public async updateMember(
    @validateParam(UpdateMemberSchema) payload: MemberRO,
    memberId: number,
  ): Promise<Result<number>> {
    const member = await this.dao.get(memberId);
    if (!member) {
      return Result.fail<number>(`Member with id ${memberId} does not exist`);
    }

    const existence = await this.checkEntitiesExistence(payload.organization, payload.resource);
    if (existence.isFailure) {
      return Result.fail<number>(existence.error);
    }
    delete payload.organization, payload.resource;
    const { currentOrg, currentRes } = await existence.getValue();

    const addresss = await this.handleAddressForMemeber(payload, true);
    if (addresss.isFailure) return Result.fail<number>(addresss.error);
    const { address, workLocation, addressHome } = await addresss.getValue();

    const phones = await this.handlePhonesForMemeber(payload, member, true);
    if (phones.isFailure) {
      return Result.fail<number>(existence.error);
    }
    const { workPhone, mobilePhone, emergencyPhone } = await phones.getValue();

    const _member = this.wrapEntity(member, {
      ...member,
      ...payload,
      organization: currentOrg ? currentOrg.getValue() : member.organization,
      resource: currentRes ? currentRes.getValue() : member.resource,
      address: address ? address : member.address,
      workLocation: workLocation ? workLocation : member.workLocation,
      addressHome: addressHome ? addressHome : member.addressHome,
      workPhone: workPhone ? workPhone : member.workPhone,
      mobilePhone: mobilePhone ? mobilePhone : member.mobilePhone,
      emergencyPhone: emergencyPhone ? emergencyPhone : member.emergencyPhone,
    });

    const updatedMember = await this.update(_member);
    if (updatedMember.isFailure) {
      return Result.fail<number>(updatedMember.error);
    }
    return Result.ok(updatedMember.getValue().id);
  }
}
