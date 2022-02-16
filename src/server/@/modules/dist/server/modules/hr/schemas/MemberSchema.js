"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMemberSchema = exports.CreateMemberSchema = void 0;
const Joi = require("joi");
const MemberSchema = Joi.object({
    resourceCalendar: Joi.number(),
    name: Joi.string(),
    active: Joi.boolean(),
    group: Joi.number(),
    job: Joi.number(),
    jobTitle: Joi.string(),
    address: Joi.object(),
    workPhone: Joi.object(),
    mobilePhone: Joi.object(),
    workEmail: Joi.string(),
    workLocation: Joi.object(),
    user: Joi.number(),
    parent: Joi.number(),
    coach: Joi.number(),
    memberType: Joi.string().required(),
    addressHome: Joi.object(),
    country: Joi.number(),
    gender: Joi.string(),
    marital: Joi.string(),
    spouseCompleteName: Joi.string(),
    spouseBirthdate: Date,
    children: Joi.number(),
    placeOfBirth: Joi.string(),
    countryOfBirth: Joi.number(),
    birthday: Date,
    identificationId: Joi.string(),
    passportId: Joi.string(),
    bankAccount: Joi.number(),
    permitNo: Joi.string(),
    visaNo: Joi.string(),
    visaExpire: Date,
    workPermitExpirationDate: Date,
    workPermitScheduledActivity: Joi.boolean(),
    additionalNote: Joi.string(),
    certificate: Joi.string(),
    studyField: Joi.string(),
    studySchool: Joi.string(),
    emergencyContact: Joi.string(),
    emergencyPhone: Joi.object(),
    notes: Joi.string(),
    departureDescription: Joi.string(),
    departureDate: Date,
});
exports.CreateMemberSchema = MemberSchema.keys({
    resource: Joi.number().required(),
    organization: Joi.number().required(),
});
exports.UpdateMemberSchema = MemberSchema.keys({
    resource: Joi.number(),
    organization: Joi.number(),
});
//# sourceMappingURL=MemberSchema.js.map