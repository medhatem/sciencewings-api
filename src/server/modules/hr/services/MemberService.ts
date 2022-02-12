import { IPhoneService } from '@modules/phones/interfaces/IPhoneService';
import { IAddressService } from '@modules/address/interfaces/IAddressService';
import { container, provideSingleton } from '@di/index';
import { BaseService } from '@modules/base/services/BaseService';
import { Member } from '@modules/hr/models/Member';
import { log } from '../../../decorators/log';
import { safeGuard } from '../../../decorators/safeGuard';
import { IMemberService } from '..';
import { MemberDao } from '../daos/MemberDao';
import { Result } from '@utils/Result';
import { CreateMemberRO } from '@modules/hr/routes/RequestObject';
import { validate } from '../../../decorators/bodyValidationDecorators/validate';
import { CreateMemberSchema } from '@modules/hr/schemas/CreateMemeberSchema';
import { IOrganizationService } from '@modules/organizations/interfaces';
import { IResourceService } from '@modules/resources/interfaces';

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

  private async checkEntitiesExistance(organization: number, resource: number): Promise<Result<any>> {
    let currentOrg, currentRes;
    if (organization) {
      currentOrg = await this.organizationService.get(organization);
      if (currentOrg.isFailure || currentOrg.getValue() === null) {
        return Result.fail<number>(`Organization with id ${organization} dose not exist.`);
      }
    }
    if (resource) {
      currentRes = await this.resourceService.get(resource);
      if (currentRes.isFailure || currentRes.getValue() === null) {
        return Result.fail<number>(`Resource with id ${resource} dose not exist.`);
      }
    }
    return Result.ok({ currentOrg, currentRes });
  }

  private async addAddressForMemeber(payload: CreateMemberRO): Promise<Result<any>> {
    let createdAddress, createdWorkLocation, createdAddressHome;

    if (payload.address) createdAddress = await this.addressService.createAddress(payload.address);
    if (payload.workLocation) createdWorkLocation = await this.addressService.createAddress(payload.workLocation);
    if (payload.addressHome) createdAddressHome = await this.addressService.createAddress(payload.addressHome);

    if (payload.address && createdAddress.isFailure) {
      return Result.fail<number>(createdAddress.error);
    } else if (payload.workLocation && createdWorkLocation.isFailure) {
      if (payload.address) await this.addressService.deleteAddress(createdAddress.getValue());
      return Result.fail<number>(createdWorkLocation.error);
    } else if (payload.addressHome && createdAddressHome.isFailure) {
      if (payload.address) await this.addressService.deleteAddress(createdAddress.getValue());
      if (payload.workLocation) await this.addressService.deleteAddress(createdWorkLocation.getValue());
      return Result.fail<number>(createdAddressHome.error);
    }

    const address = payload.address ? createdAddress.getValue() : null;
    const workLocation = payload.workLocation ? createdWorkLocation.getValue() : null;
    const addressHome = payload.addressHome ? createdAddressHome.getValue() : null;

    return Result.ok({ address, workLocation, addressHome });
  }

  private async addPhonesForMemeber(payload: CreateMemberRO): Promise<Result<any>> {
    let createdWorkPhone, createdMobilePhone, createdEmergencyPhone;

    if (payload.workPhone) createdWorkPhone = await this.phoneService.createPhone(payload.workPhone);
    if (payload.mobilePhone) createdMobilePhone = await this.phoneService.createPhone(payload.mobilePhone);
    if (payload.emergencyPhone) createdEmergencyPhone = await this.phoneService.createPhone(payload.emergencyPhone);

    if (payload.workPhone && createdWorkPhone.isFailure) {
      return Result.fail<number>(createdWorkPhone.error);
    } else if (payload.mobilePhone && createdMobilePhone.isFailure) {
      await this.phoneService.deletePhone(createdWorkPhone.getValue());
      return Result.fail<number>(createdMobilePhone.error);
    } else if (payload.emergencyPhone && createdEmergencyPhone.isFailure) {
      await this.phoneService.deletePhone(createdWorkPhone.getValue());
      await this.phoneService.deletePhone(createdMobilePhone.getValue());
      return Result.fail<number>(createdEmergencyPhone.error);
    }

    const workPhone = payload.workPhone ? createdWorkPhone.getValue() : null;
    const mobilePhone = payload.mobilePhone ? createdMobilePhone.getValue() : null;
    const emergencyPhone = payload.emergencyPhone ? createdEmergencyPhone.getValue() : null;

    return Result.ok({ workPhone, mobilePhone, emergencyPhone });
  }

  @log()
  @safeGuard()
  @validate(CreateMemberSchema)
  public async createMember(payload: CreateMemberRO): Promise<Result<number>> {
    const existance = await this.checkEntitiesExistance(payload.organization, payload.resource);
    if (existance.isFailure) return Result.fail<number>(existance.error);
    const { currentOrg, currentRes } = await existance.getValue();

    const addresss = await this.addAddressForMemeber(payload);
    if (addresss.isFailure) return Result.fail<number>(addresss.error);
    const { address, workLocation, addressHome } = await addresss.getValue();

    const phones = await this.addPhonesForMemeber(payload);
    if (phones.isFailure) return Result.fail<number>(existance.error);
    const { workPhone, mobilePhone, emergencyPhone } = await phones.getValue();

    const member: Member = {
      id: null,
      ...payload,
      organization: currentOrg.getValue(),
      resource: currentRes.getValue(),
      address,
      workLocation,
      addressHome,
      workPhone,
      mobilePhone,
      emergencyPhone,
    };

    const createdMember = await this.create(member);
    console.log('*', createdMember);
    if (createdMember.isFailure) {
      return Result.fail<number>(createdMember.error);
    }
    return Result.ok(createdMember.getValue().id);
  }

  @log()
  @safeGuard()
  @validate(CreateMemberSchema)
  public async updateMember(payload: CreateMemberRO, memberId: number): Promise<Result<number>> {
    const member = await this.dao.get(memberId);

    const existance = await this.checkEntitiesExistance(payload.organization, payload.resource);

    if (existance.isFailure) return Result.fail<number>(existance.error);
    // const { currentOrg, currentRes } = await existance.getValue();
    // const newMember: any = {
    //   id: memberId,
    //   ...member,
    // };

    // if (payload.organization) newMember.organization = currentOrg.getValue();
    // if (payload.resource) newMember.resource = currentRes.getValue();

    // delete payload.organization;
    // delete payload.resource;

    // newMember = { ...payload };

    const updateddMember = await this.update(member);
    if (updateddMember.isFailure) {
      return Result.fail<number>(updateddMember.error);
    }
    return Result.ok(updateddMember.getValue().id);
  }
}
