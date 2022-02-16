"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCredentialsSchema = void 0;
const Joi = require("joi");
exports.userCredentialsSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'wrong email format',
        'any.required': 'email is required',
    }),
    password: Joi.string().required().messages({ 'any.required': 'password is required' }),
});
//# sourceMappingURL=userCredentials.js.map