"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateResourceSchema = exports.CreateResourceSchema = exports.ResourceCalendarSchema = void 0;
const Joi = require("joi");
exports.ResourceCalendarSchema = Joi.object({
    name: Joi.string().required(),
    active: Joi.boolean(),
    organization: Joi.number(),
    hoursPerDay: Joi.number(),
    timezone: Joi.string().required(),
    twoWeeksCalendar: Joi.boolean(),
});
const ResourceSchema = Joi.object({
    active: Joi.boolean(),
    organization: Joi.number(),
    user: Joi.number(),
    timezone: Joi.string(),
});
exports.CreateResourceSchema = ResourceSchema.keys({
    name: Joi.string().required(),
    resourceType: Joi.string().required(),
    timeEfficiency: Joi.number().required(),
    calendar: exports.ResourceCalendarSchema.required(),
});
exports.UpdateResourceSchema = ResourceSchema.keys({
    name: Joi.string(),
    resourceType: Joi.string(),
    timeEfficiency: Joi.number(),
    calendar: exports.ResourceCalendarSchema,
});
//# sourceMappingURL=CreateResourceSchema.js.map