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
var Email_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
const index_1 = require("@di/index");
const Configuration_1 = require("../configuration/Configuration");
const mail_1 = require("@sendgrid/mail");
let Email = Email_1 = class Email extends mail_1.MailService {
    constructor() {
        super();
        this.from = (0, Configuration_1.getConfig)('email.from');
        // TODO: should use the config instead
        this.setApiKey((0, Configuration_1.getConfig)('email.sendGridApiKey'));
    }
    static getInstance() {
        return index_1.container.get(Email_1);
    }
    setFrom(from) {
        this.from = from;
    }
    sendEmail(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send(message);
        });
    }
};
Email = Email_1 = __decorate([
    (0, index_1.provideSingleton)(),
    __metadata("design:paramtypes", [])
], Email);
exports.Email = Email;
//# sourceMappingURL=Email.js.map