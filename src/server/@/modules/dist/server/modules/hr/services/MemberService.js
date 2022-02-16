"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberService = void 0;
const MemberSchema_1 = require("@/modules/hr/schemas/MemberSchema");
const index_1 = require("@di/index");
const BaseService_1 = require("@/modules/base/services/BaseService");
const IAddressService_1 = require("@/modules/address/interfaces/IAddressService");
const __1 = require("..");
const interfaces_1 = require("@/modules/organizations/interfaces");
const IPhoneService_1 = require("@/modules/phones/interfaces/IPhoneService");
const interfaces_2 = require("@/modules/resources/interfaces");
const MemberDao_1 = require("../daos/MemberDao");
const Result_1 = require("@utils/Result");
const log_1 = require("@/modules/../decorators/log");
const safeGuard_1 = require("@/modules/../decorators/safeGuard");
const validate_1 = require("@/decorators/validate");
const validateParam_1 = require("@/decorators/validateParam");
let MemberService = class MemberService extends BaseService_1.BaseService {
    constructor(dao, organizationService, addressService, phoneService, resourceService) {
        super(dao);
        this.dao = dao;
        this.organizationService = organizationService;
        this.addressService = addressService;
        this.phoneService = phoneService;
        this.resourceService = resourceService;
    }
    static getInstance() {
        return index_1.container.get(__1.IMemberService);
    }
    checkEntitiesExistance(organization, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentOrg, currentRes;
            if (organization) {
                currentOrg = yield this.organizationService.get(organization);
                if (currentOrg.isFailure || currentOrg.getValue() === null) {
                    return Result_1.Result.fail(`Organization with id ${organization} dose not exist.`);
                }
            }
            if (resource) {
                currentRes = yield this.resourceService.get(resource);
                if (currentRes.isFailure || currentRes.getValue() === null) {
                    return Result_1.Result.fail(`Resource with id ${resource} dose not exist.`);
                }
            }
            return Result_1.Result.ok({ currentOrg, currentRes });
        });
    }
    handleAddressForMemeber(payload, isUpdate = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let createdAddress, createdWorkLocation, createdAddressHome;
            if (isUpdate) {
                if (payload.address) {
                    const fetchedAdress = yield this.addressService.get(payload.address.id);
                    if (fetchedAdress.isFailure)
                        return Result_1.Result.fail(fetchedAdress.error);
                    const address = Object.assign(Object.assign({}, fetchedAdress.getValue()), payload.address);
                    this.addressService.update(address);
                }
                if (payload.workLocation) {
                    const fetchedWorkLocation = yield this.addressService.get(payload.address.id);
                    if (fetchedWorkLocation.isFailure)
                        return Result_1.Result.fail(fetchedWorkLocation.error);
                    const workLocation = Object.assign(Object.assign({}, fetchedWorkLocation.getValue()), payload.workLocation);
                    this.addressService.update(workLocation);
                }
                if (payload.addressHome) {
                    const fetchedAddressHome = yield this.addressService.get(payload.address.id);
                    if (fetchedAddressHome.isFailure)
                        return Result_1.Result.fail(fetchedAddressHome.error);
                    const addressHome = Object.assign(Object.assign({}, fetchedAddressHome.getValue()), payload.addressHome);
                    this.addressService.update(addressHome);
                }
            }
            if (payload.address)
                createdAddress = yield this.addressService.createAddress(payload.address);
            if (payload.workLocation)
                createdWorkLocation = yield this.addressService.createAddress(payload.workLocation);
            if (payload.addressHome)
                createdAddressHome = yield this.addressService.createAddress(payload.addressHome);
            if (payload.address)
                createdAddress = yield this.addressService.createAddress(payload.address);
            if (payload.workLocation)
                createdWorkLocation = yield this.addressService.createAddress(payload.workLocation);
            if (payload.addressHome)
                createdAddressHome = yield this.addressService.createAddress(payload.addressHome);
            if (payload.address && createdAddress.isFailure) {
                return Result_1.Result.fail(createdAddress.error);
            }
            else if (payload.workLocation && createdWorkLocation.isFailure) {
                if (payload.address)
                    yield this.addressService.remove(createdAddress.getValue().id);
                return Result_1.Result.fail(createdWorkLocation.error);
            }
            else if (payload.addressHome && createdAddressHome.isFailure) {
                if (payload.address)
                    yield this.addressService.remove(createdAddress.getValue().id);
                if (payload.workLocation)
                    yield this.addressService.remove(createdWorkLocation.getValue().id);
                return Result_1.Result.fail(createdAddressHome.error);
            }
            const address = payload.address ? createdAddress.getValue() : null;
            const workLocation = payload.workLocation ? createdWorkLocation.getValue() : null;
            const addressHome = payload.addressHome ? createdAddressHome.getValue() : null;
            return Result_1.Result.ok({ address, workLocation, addressHome });
        });
    }
    handlePhonesForMemeber(payload, isUpdate = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let createdWorkPhone, createdMobilePhone, createdEmergencyPhone;
            if (isUpdate) {
                if (payload.workPhone)
                    this.phoneService.remove(payload.workPhone.id);
                if (payload.mobilePhone)
                    this.phoneService.remove(payload.mobilePhone.id);
                if (payload.emergencyPhone)
                    this.phoneService.remove(payload.emergencyPhone.id);
            }
            if (isUpdate) {
                if (payload.workPhone) {
                    const fetchedWorkPhone = yield this.phoneService.get(payload.workPhone.id);
                    if (fetchedWorkPhone.isFailure)
                        return Result_1.Result.fail(fetchedWorkPhone.error);
                    const workPhone = Object.assign(Object.assign({}, fetchedWorkPhone.getValue()), payload.workPhone);
                    this.phoneService.update(workPhone);
                }
                if (payload.mobilePhone) {
                    const fetchedMobilePhone = yield this.phoneService.get(payload.address.id);
                    if (fetchedMobilePhone.isFailure)
                        return Result_1.Result.fail(fetchedMobilePhone.error);
                    const mobilePhone = Object.assign(Object.assign({}, fetchedMobilePhone.getValue()), payload.mobilePhone);
                    this.phoneService.update(mobilePhone);
                }
                if (payload.emergencyPhone) {
                    const fetchedEmergencyPhone = yield this.phoneService.get(payload.address.id);
                    if (fetchedEmergencyPhone.isFailure)
                        return Result_1.Result.fail(fetchedEmergencyPhone.error);
                    const emergencyPhone = Object.assign(Object.assign({}, fetchedEmergencyPhone.getValue()), payload.emergencyPhone);
                    this.phoneService.update(emergencyPhone);
                }
            }
            if (payload.workPhone)
                createdWorkPhone = yield this.phoneService.createPhone(payload.workPhone);
            if (payload.mobilePhone)
                createdMobilePhone = yield this.phoneService.createPhone(payload.mobilePhone);
            if (payload.emergencyPhone)
                createdEmergencyPhone = yield this.phoneService.createPhone(payload.emergencyPhone);
            if (payload.workPhone && createdWorkPhone.isFailure) {
                return Result_1.Result.fail(createdWorkPhone.error);
            }
            else if (payload.mobilePhone && createdMobilePhone.isFailure) {
                yield this.phoneService.remove(createdWorkPhone.getValue().id);
                return Result_1.Result.fail(createdMobilePhone.error);
            }
            else if (payload.emergencyPhone && createdEmergencyPhone.isFailure) {
                yield this.phoneService.remove(createdWorkPhone.getValue().id);
                yield this.phoneService.remove(createdMobilePhone.getValue().id);
                return Result_1.Result.fail(createdEmergencyPhone.error);
            }
            const workPhone = payload.workPhone ? createdWorkPhone.getValue() : null;
            const mobilePhone = payload.mobilePhone ? createdMobilePhone.getValue() : null;
            const emergencyPhone = payload.emergencyPhone ? createdEmergencyPhone.getValue() : null;
            return Result_1.Result.ok({ workPhone, mobilePhone, emergencyPhone });
        });
    }
    createMember(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const existance = yield this.checkEntitiesExistance(payload.organization, payload.resource);
            if (existance.isFailure)
                return Result_1.Result.fail(existance.error);
            const { currentOrg, currentRes } = yield existance.getValue();
            const addresss = yield this.handleAddressForMemeber(payload);
            if (addresss.isFailure)
                return Result_1.Result.fail(addresss.error);
            const { address, workLocation, addressHome } = yield addresss.getValue();
            const phones = yield this.handlePhonesForMemeber(payload);
            if (phones.isFailure)
                return Result_1.Result.fail(existance.error);
            const { workPhone, mobilePhone, emergencyPhone } = yield phones.getValue();
            const member = Object.assign(Object.assign({ id: null }, payload), { organization: currentOrg.getValue(), resource: currentRes.getValue(), address,
                workLocation,
                addressHome,
                workPhone,
                mobilePhone,
                emergencyPhone });
            const createdMember = yield this.create(member);
            if (createdMember.isFailure) {
                return Result_1.Result.fail(createdMember.error);
            }
            return Result_1.Result.ok(createdMember.getValue().id);
        });
    }
    updateMember(payload, memberId) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.dao.get(memberId);
            if (!member) {
                return Result_1.Result.fail(`Member with id ${memberId} does not exist`);
            }
            const existance = yield this.checkEntitiesExistance(payload.organization, payload.resource);
            if (existance.isFailure)
                return Result_1.Result.fail(existance.error);
            delete payload.organization, payload.resource;
            const { currentOrg, currentRes } = yield existance.getValue();
            const addresss = yield this.handleAddressForMemeber(payload, true);
            if (addresss.isFailure)
                return Result_1.Result.fail(addresss.error);
            const { address, workLocation, addressHome } = yield addresss.getValue();
            const phones = yield this.handlePhonesForMemeber(payload, true);
            if (phones.isFailure)
                return Result_1.Result.fail(existance.error);
            const { workPhone, mobilePhone, emergencyPhone } = yield phones.getValue();
            const _member = this.wrapEntity(member, Object.assign(Object.assign(Object.assign({}, member), payload), { organization: currentOrg ? currentOrg.getValue() : member.organization, resource: currentRes ? currentRes.getValue() : member.resource, address: address ? address : member.address, workLocation: workLocation ? workLocation : member.workLocation, addressHome: addressHome ? addressHome : member.addressHome, workPhone: workPhone ? workPhone : member.workPhone, mobilePhone: mobilePhone ? mobilePhone : member.mobilePhone, emergencyPhone: emergencyPhone ? emergencyPhone : member.emergencyPhone }));
            const updatedMember = yield this.update(_member);
            if (updatedMember.isFailure) {
                return Result_1.Result.fail(updatedMember.error);
            }
            return Result_1.Result.ok(updatedMember.getValue().id);
        });
    }
};
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    validate_1.validate,
    __param(0, (0, validateParam_1.validateParam)(MemberSchema_1.CreateMemberSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberService.prototype, "createMember", null);
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    validate_1.validate,
    __param(0, (0, validateParam_1.validateParam)(MemberSchema_1.UpdateMemberSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], MemberService.prototype, "updateMember", null);
MemberService = __decorate([
    (0, index_1.provideSingleton)(__1.IMemberService),
    __metadata("design:paramtypes", [MemberDao_1.MemberDao,
        interfaces_1.IOrganizationService,
        IAddressService_1.IAddressService,
        IPhoneService_1.IPhoneService,
        interfaces_2.IResourceService])
], MemberService);
exports.MemberService = MemberService;
//# sourceMappingURL=MemberService.js.map