"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const Organization_1 = require("@/modules/organizations/models/Organization");
exports.default = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phones: Joi.array(),
    labels: Joi.array(),
    type: Joi.string().valid(...Object.values(Organization_1.OrganizationType)),
    social_facebook: Joi.string(),
    social_instagram: Joi.string(),
    social_youtube: Joi.string(),
    social_github: Joi.string(),
    social_twitter: Joi.string(),
    social_linkedin: Joi.string(),
    members: Joi.array(),
    social: Joi.array(),
    address: Joi.array(),
    direction: Joi.number().required(),
    adminContact: Joi.number().required(),
});
//# sourceMappingURL=createOrganizationSchema.js.map