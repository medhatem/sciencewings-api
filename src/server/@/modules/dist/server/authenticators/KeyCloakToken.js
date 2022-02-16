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
exports.KeyCloakToken = void 0;
const userExctractionAndValidation_1 = require("./userExctractionAndValidation");
const di_1 = require("../di");
let KeyCloakToken = class KeyCloakToken {
    constructor(userExtractorAndValidator) {
        this.userExtractorAndValidator = userExtractorAndValidator;
    }
    getMiddleware() {
        return (req, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userExtractorAndValidator.userExctractionAndValidation(req);
                if (result.isFailure) {
                    response.status(403).json({
                        error: result.error,
                    });
                    response.end();
                }
                next();
            }
            catch (error) {
                response.status(403).json({
                    error: error.message,
                });
                response.end();
            }
        });
    }
    getRoles() {
        return [];
    }
    initialize(router) {
        router.use((req, response, next) => {
            next();
        });
    }
};
KeyCloakToken = __decorate([
    (0, di_1.provideSingleton)(),
    __metadata("design:paramtypes", [userExctractionAndValidation_1.UserExctractionAndValidation])
], KeyCloakToken);
exports.KeyCloakToken = KeyCloakToken;
//# sourceMappingURL=KeyCloakToken.js.map