'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function') return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.OrganizationService = void 0;
const index_1 = require('@di/index');
const BaseService_1 = require('@/modules/base/services/BaseService');
const RequestObject_1 = require('../routes/RequestObject');
const IOrganizationService_1 = require('../interfaces/IOrganizationService');
const OrganizationDao_1 = require('../daos/OrganizationDao');
const Result_1 = require('@utils/Result');
const User_1 = require('@/modules/users/models/User');
const log_1 = require('@/modules/../decorators/log');
const safeGuard_1 = require('@/modules/../decorators/safeGuard');
const Email_1 = require('@utils/Email');
const createOrganizationSchema_1 = require('../schemas/createOrganizationSchema');
const Configuration_1 = require('./@/modules/configuration/Configuration');
const IPhoneService_1 = require('@/modules/phones/interfaces/IPhoneService');
const IAddressService_1 = require('@/modules/address/interfaces/IAddressService');
const interfaces_1 = require('@/modules/users/interfaces');
const IOrganizationLabelService_1 = require('@/modules/organizations/interfaces/IOrganizationLabelService');
const validateParam_1 = require('@/decorators/validateParam');
const validate_1 = require('@/decorators/validate');
let OrganizationService = class OrganizationService extends BaseService_1.BaseService {
  constructor(dao, userService, labelService, adressService, phoneService, emailService) {
    super(dao);
    this.dao = dao;
    this.userService = userService;
    this.labelService = labelService;
    this.adressService = adressService;
    this.phoneService = phoneService;
    this.emailService = emailService;
  }
  static getInstance() {
    return index_1.container.get(IOrganizationService_1.IOrganizationService);
  }
  createOrganization(payload, userId) {
    return __awaiter(this, void 0, void 0, function* () {
      const existingOrg = yield this.dao.getByCriteria({ name: payload.name });
      if (existingOrg) {
        return Result_1.Result.fail(`Organization ${payload.name} already exist.`);
      }
      if (payload.parentId) {
        const org = yield this.dao.getByCriteria({ id: payload.parentId });
        if (!org) {
          return Result_1.Result.fail('Organization parent does not exist');
        }
      }
      const fetchedUser = yield this.userService.getUserByCriteria({ id: userId });
      if (fetchedUser.isFailure) {
        return Result_1.Result.fail(`User with id: ${userId} parent does not exist`);
      }
      const user = fetchedUser.getValue();
      let adminContact;
      if (payload.adminContact) {
        adminContact = yield this.userService.getUserByCriteria({ id: payload.adminContact });
        if (!adminContact) {
          return Result_1.Result.fail(`User with id: ${payload.adminContact} does not exist.`);
        }
      }
      let direction;
      if (payload.direction) {
        direction = yield this.userService.getUserByCriteria({ id: payload.direction });
        if (!direction) {
          return Result_1.Result.fail(`User with id: ${payload.direction} does not exist.`);
        }
      }
      const organization = this.wrapEntity(this.dao.model, {
        name: payload.name,
        email: payload.email,
        type: payload.type,
        social_facebook: payload.social_facebook,
        social_instagram: payload.social_instagram,
        social_youtube: payload.social_youtube,
        social_github: payload.social_github,
        social_twitter: payload.social_twitter,
        social_linkedin: payload.social_linkedin,
      });
      organization.direction = yield direction.getValue();
      organization.admin_contact = yield adminContact.getValue();
      yield user.organizations.init();
      user.organizations.add(organization);
      const _createdOrg = yield this.create(organization);
      if (_createdOrg.isFailure) {
        return Result_1.Result.fail(_createdOrg.error);
      }
      const createdOrg = yield _createdOrg.getValue();
      createdOrg.parent = existingOrg;
      yield this.update(createdOrg);
      if (payload.address.length) this.adressService.createBulkAddress(payload.address);
      if (payload.phones.length) this.phoneService.createBulkPhoneForOrganization(payload.phones, createdOrg);
      if (payload.labels.length) this.labelService.createBulkLabel(payload.labels, createdOrg);
      let flagError = false;
      yield Promise.all(
        payload.members.map((el) =>
          __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.getUserByCriteria({ id: el });
            if (user.isFailure || !user) {
              flagError = true;
            }
            if (user) createdOrg.members.add(user.getValue());
          }),
        ),
      );
      if (flagError) {
        return Result_1.Result.fail(`User in members does not exist.`);
      }
      yield this.update(createdOrg);
      return Result_1.Result.ok(createdOrg.id);
    });
  }
  inviteUserByEmail(email, orgId) {
    return __awaiter(this, void 0, void 0, function* () {
      const existingUser = yield this.keycloak
        .getAdminClient()
        .users.find({ email, realm: (0, Configuration_1.getConfig)('keycloak.clientValidation.realmName') });
      if (existingUser.length > 0) {
        return Result_1.Result.fail('The user already exist.');
      }
      const existingOrg = yield this.dao.get(orgId);
      if (!existingOrg) {
        return Result_1.Result.fail('The organization to add the user to does not exist.');
      }
      const createdKeyCloakUser = yield this.keycloak.getAdminClient().users.create({
        email,
        firstName: '',
        lastName: '',
        realm: (0, Configuration_1.getConfig)('keycloak.clientValidation.realmName'),
      });
      //save created keycloak user in the database
      const user = new User_1.User();
      user.firstname = '';
      user.lastname = '';
      user.email = email;
      user.keycloakId = createdKeyCloakUser.id;
      const savedUser = yield this.userService.create(user);
      if (savedUser.isFailure) {
        return Result_1.Result.fail(savedUser.error);
      }
      // add the invited user to the organization
      yield existingOrg.members.init();
      existingOrg.members.add(savedUser.getValue());
      yield this.userService.update(savedUser.getValue());
      const emailMessage = {
        from: this.emailService.from,
        to: email,
        text: 'Sciencewings - reset password',
        html: '<html><body>Reset password</body></html>',
        subject: ' reset password',
      };
      this.emailService.sendEmail(emailMessage);
      return Result_1.Result.ok(savedUser.getValue().id);
    });
  }
  getMembers(orgId) {
    return __awaiter(this, void 0, void 0, function* () {
      const existingOrg = yield this.dao.get(orgId);
      if (!existingOrg) {
        return Result_1.Result.fail(`Organization with id ${orgId} does not exist.`);
      }
      const members = yield existingOrg.members.init();
      return Result_1.Result.ok(members);
    });
  }
  getUserOrganizations(userId) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield this.userService.getUserByCriteria({ id: userId });
      if (user.isFailure) {
        return Result_1.Result.fail(user.error);
      }
      const fetchedUsersOrganization = yield user.getValue().organizations.init();
      const organizations = fetchedUsersOrganization.toArray().map((org) => {
        return { id: org.id, name: org.name };
      });
      return Result_1.Result.ok(organizations);
    });
  }
};
__decorate(
  [
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    validate_1.validate,
    __param(0, (0, validateParam_1.validateParam)(createOrganizationSchema_1.default)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [RequestObject_1.CreateOrganizationRO, Number]),
    __metadata('design:returntype', Promise),
  ],
  OrganizationService.prototype,
  'createOrganization',
  null,
);
__decorate(
  [
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String, Number]),
    __metadata('design:returntype', Promise),
  ],
  OrganizationService.prototype,
  'inviteUserByEmail',
  null,
);
__decorate(
  [
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', Promise),
  ],
  OrganizationService.prototype,
  'getMembers',
  null,
);
__decorate(
  [
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', Promise),
  ],
  OrganizationService.prototype,
  'getUserOrganizations',
  null,
);
OrganizationService = __decorate(
  [
    (0, index_1.provideSingleton)(IOrganizationService_1.IOrganizationService),
    __metadata('design:paramtypes', [
      OrganizationDao_1.OrganizationDao,
      interfaces_1.IUserService,
      IOrganizationLabelService_1.IOrganizationLabelService,
      IAddressService_1.IAddressService,
      IPhoneService_1.IPhoneService,
      Email_1.Email,
    ]),
  ],
  OrganizationService,
);
exports.OrganizationService = OrganizationService;
//# sourceMappingURL=OrganizationService.js.map
