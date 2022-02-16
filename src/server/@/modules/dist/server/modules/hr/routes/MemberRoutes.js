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
var MemberRoutes_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberRoutes = void 0;
const index_1 = require("@di/index");
const BaseRoutes_1 = require("@/modules/base/routes/BaseRoutes");
const typescript_rest_1 = require("typescript-rest");
const MemberDTO_1 = require("../dtos/MemberDTO");
const constants_1 = require("@/modules/../authenticators/constants");
const loggerStorage_1 = require("@/decorators/loggerStorage");
const RequestObject_1 = require("./RequestObject");
const interfaces_1 = require("@/modules/hr/interfaces");
const CreateMemberDTO_1 = require("@/modules/hr/dtos/CreateMemberDTO");
const UpdateMemberDTO_1 = require("@/modules/hr/dtos/UpdateMemberDTO");
let MemberRoutes = MemberRoutes_1 = class MemberRoutes extends BaseRoutes_1.BaseRoutes {
    constructor(memberService) {
        super(memberService, new CreateMemberDTO_1.CreateMemberDTO(), new UpdateMemberDTO_1.UpdateMemberDTO());
        this.memberService = memberService;
    }
    static getInstance() {
        return index_1.container.get(MemberRoutes_1);
    }
    createMember(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.memberService.createMember(payload);
            if (result.isFailure) {
                return new MemberDTO_1.MemberDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
            }
            return new MemberDTO_1.MemberDTO().serialize({ body: { memberId: result.getValue(), statusCode: 201 } });
        });
    }
    createUpdateMember(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.memberService.updateMember(payload, id);
            if (result.isFailure) {
                return new MemberDTO_1.MemberDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
            }
            return new MemberDTO_1.MemberDTO().serialize({ body: { memberId: result.getValue(), statusCode: 201 } });
        });
    }
};
__decorate([
    typescript_rest_1.POST,
    (0, typescript_rest_1.Path)('create'),
    (0, typescript_rest_1.Security)('', constants_1.KEYCLOAK_TOKEN),
    (0, loggerStorage_1.LoggerStorage)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RequestObject_1.CreateMemberRO]),
    __metadata("design:returntype", Promise)
], MemberRoutes.prototype, "createMember", null);
__decorate([
    typescript_rest_1.PUT,
    (0, typescript_rest_1.Path)('/update/:id'),
    (0, typescript_rest_1.Security)('', constants_1.KEYCLOAK_TOKEN),
    (0, loggerStorage_1.LoggerStorage)(),
    __param(1, (0, typescript_rest_1.PathParam)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RequestObject_1.CreateMemberRO, Number]),
    __metadata("design:returntype", Promise)
], MemberRoutes.prototype, "createUpdateMember", null);
MemberRoutes = MemberRoutes_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, typescript_rest_1.Path)('members'),
    __metadata("design:paramtypes", [interfaces_1.IMemberService])
], MemberRoutes);
exports.MemberRoutes = MemberRoutes;
//# sourceMappingURL=MemberRoutes.js.map