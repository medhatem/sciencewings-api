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
exports.UserService = void 0;
const RequstObjects_1 = require("../routes/RequstObjects");
const index_1 = require("@di/index");
const BaseService_1 = require("@/modules/base/services/BaseService");
const Email_1 = require("@utils/Email");
const IPhoneService_1 = require("@/modules/phones/interfaces/IPhoneService");
const IUserService_1 = require("@/modules/users/interfaces/IUserService");
const keycloak_1 = require("@sdks/keycloak");
const Result_1 = require("@utils/Result");
const User_1 = require("@/modules/users/models/User");
const UserDao_1 = require("../daos/UserDao");
const Configuration_1 = require("@/modules/../configuration/Configuration");
const log_1 = require("@/decorators/log");
const safeGuard_1 = require("@/decorators/safeGuard");
let UserService = class UserService extends BaseService_1.BaseService {
    constructor(dao, phoneSerice, keycloak = keycloak_1.Keycloak.getInstance(), emailService = Email_1.Email.getInstance()) {
        super(dao);
        this.dao = dao;
        this.phoneSerice = phoneSerice;
        this.keycloak = keycloak;
        this.emailService = emailService;
    }
    static getInstance() {
        return index_1.container.get(IUserService_1.IUserService);
    }
    updateUserDetails(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phones } = payload;
            delete payload.phones;
            const userDetail = this.wrapEntity(this.dao.model, payload);
            const authedUser = yield this.dao.get(userId);
            if (!authedUser) {
                return Result_1.Result.fail(`User with id ${userId} does not exist`);
            }
            const user = Object.assign(Object.assign({}, authedUser), userDetail);
            yield Promise.all(phones.map((p) => __awaiter(this, void 0, void 0, function* () {
                yield this.phoneSerice.createPhone(p);
            })));
            yield this.dao.update(user);
            return Result_1.Result.ok(userId);
        });
    }
    registerUser(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            // get the userKeyCloakId
            const users = yield this.keycloak.getAdminClient().users.find({ email: userInfo.email, realm: 'sciencewings-web' });
            if (!users || !users.length) {
                return Result_1.Result.fail('No user found');
            }
            const user = this.dao.model;
            user.firstname = userInfo.given_name;
            user.lastname = userInfo.family_name;
            user.email = userInfo.email;
            user.keycloakId = users[0].id;
            let createdUser = { id: null };
            try {
                createdUser = yield this.dao.create(user);
                //TODO send email
            }
            catch (error) {
                return Result_1.Result.fail(error);
            }
            return Result_1.Result.ok(createdUser.id);
        });
    }
    /**
     * fetches a user based on some search criteria
     *
     * @param criteria the search criteria
     */
    getUserByCriteria(criteria) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.dao.getByCriteria(criteria);
                return Result_1.Result.ok(user);
            }
            catch (error) {
                return Result_1.Result.fail(error);
            }
        });
    }
    /**
     * reset a user password
     *
     * @param payload
     */
    resetPassword(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (payload.password !== payload.passwordConfirmation) {
                return Result_1.Result.fail("Passwords don't match");
            }
            const user = yield this.dao.getByCriteria({ email: payload.email });
            if (!user) {
                return Result_1.Result.fail(`user with email: ${payload.email} does not exist.`);
            }
            yield this.keycloak.getAdminClient().users.resetPassword({
                realm: (0, Configuration_1.getConfig)('keycloak.clientValidation.realmName'),
                id: user.keycloakId,
                credential: {
                    temporary: false,
                    type: 'password',
                    value: payload.password,
                },
            });
            return Result_1.Result.ok('Password reset successful');
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let createdUser;
            try {
                createdUser = yield this.dao.create(user);
            }
            catch (error) {
                return Result_1.Result.fail(error);
            }
            return Result_1.Result.ok(createdUser);
        });
    }
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let newUser = yield this.dao.get(user.id);
            if (!newUser)
                return Result_1.Result.fail(`User with id ${user.id} does not exist.`);
            try {
                newUser = yield this.dao.update(user);
            }
            catch (error) {
                return Result_1.Result.fail(error);
            }
            return Result_1.Result.ok(newUser);
        });
    }
    getUserByKeycloakId(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.dao.getByCriteria({ keycloakId: payload });
            if (!user) {
                return Result_1.Result.fail(`User with KCID ${payload} does not exist.`);
            }
            return Result_1.Result.ok(user);
        });
    }
};
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RequstObjects_1.UserDetailsRO, Number]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "updateUserDetails", null);
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "registerUser", null);
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "getUserByCriteria", null);
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RequstObjects_1.ResetPasswordRO]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "resetPassword", null);
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "create", null);
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "update", null);
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "getUserByKeycloakId", null);
UserService = __decorate([
    (0, index_1.provideSingleton)(IUserService_1.IUserService),
    __metadata("design:paramtypes", [UserDao_1.UserDao,
        IPhoneService_1.IPhoneService,
        keycloak_1.Keycloak, Object])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map